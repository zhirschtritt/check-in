import {ClassType, transformAndValidate} from 'class-transformer-validator';
import {validateOrReject, ValidationError} from 'class-validator';
import {Inject} from '@nestjs/common';
import {FirestoreDbClientFactory} from './firestore-client-factory';
import {firestore} from 'firebase-admin';
import {LogFactory, AppLogger} from '../common/logger';

export interface Repository<T> {
  create(obj: T): Promise<T>;
  findOne(id: string): Promise<T | null>;
  findAll(): Promise<T[] | null>;
  update(id: string, obj: Partial<T>): Promise<T>;
  upsert(obj: T, id?: string): Promise<T>;
  delete(id: string): Promise<void>;
}

export interface FirestoreTimestamp {
  createdAt: firestore.FieldValue;
  updatedAt: firestore.FieldValue;
}

export type FirestoreDocument = firestore.DocumentData & FirestoreTimestamp;

export abstract class FirestoreRepository<T extends FirestoreDocument> implements Repository<T> {
  private readonly collection: firestore.CollectionReference;
  private readonly logger: AppLogger;

  constructor(
    collectionId: string,
    private readonly classType: ClassType<T>,
    @Inject(FirestoreDbClientFactory)
    private readonly firestoreClient: firestore.Firestore,
    @Inject(LogFactory) logFactory: LogFactory,
  ) {
    this.logger = logFactory('FirestoreRepository');
    this.collection = firestoreClient.collection(collectionId);
  }

  public async create(obj: T): Promise<T> {
    try {
      await validateOrReject(obj);
      obj.createdAt = firestore.FieldValue.serverTimestamp();
      obj.updatedAt = firestore.FieldValue.serverTimestamp();
      const docRef = await this.collection.add(obj);
      return await transformAndValidate(this.classType, await docRef.get());
    } catch (err) {
      this.logger.error({err}, 'Error creating new firestore doc');
      throw new Error('Error creating new firestore doc');
    }
  }

  public async findOne(id: string): Promise<T | null> {
    try {
      const doc = await this.collection.doc(id).get();
      return doc !== null ? await transformAndValidate(this.classType, doc) : null;
    } catch (err) {
      this.logger.error({err}, 'Error finding firestore doc');
      throw new Error('Error finding firestore doc');
    }
  }

  public async findAll(): Promise<T[]> {
    try {
      const allDocRefs = (await this.collection.get()).docs;
      return await Promise.all(
        allDocRefs.map(async docRef => {
          const doc = await docRef.data();
          return await transformAndValidate(this.classType, doc);
        }),
      );
    } catch (err) {
      this.logger.error({err}, 'Error finding firestore doc');
      throw new Error('Error finding firestore doc');
    }
  }

  public async update(id: string, obj: Partial<T>): Promise<T> {
    try {
      const docRef = this.collection.doc(id);
      obj.updatedAt = firestore.FieldValue.serverTimestamp();
      await docRef.update(obj);
      const updateDoc = await docRef.get();
      return await transformAndValidate(this.classType, updateDoc);
    } catch (err) {
      this.logger.error({err}, 'Error updating firestore doc');
      throw new Error('Error updating firestore doc');
    }
  }

  public async upsert(obj: T, id?: string) {
    try {
      if (id) {
        return this.update(id, obj);
      }
      return this.create(obj);
    } catch (err) {
      this.logger.error({err}, 'Error upserting firestore doc');
      throw new Error('Error upserting firestore doc');
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      await this.collection.doc(id).delete();
    } catch (err) {
      this.logger.error({err}, 'Error deleting firestore doc');
      throw new Error('Error deleting firestore doc');
    }
  }
}
