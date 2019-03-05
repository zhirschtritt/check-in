import {ClassType, transformAndValidate} from 'class-transformer-validator';
import {Inject, Injectable} from '@nestjs/common';
import {firestore} from 'firebase-admin';
import {LogFactory, AppLogger} from '../common/logger';
import {di_keys} from '../common/di-keys';
import {DocumentSnapshot, DocumentData} from '@google-cloud/firestore';
import {Timestamped} from '@core';

export interface Repository<T> {
  create(obj: T): Promise<T>;
  findOne(id: string): Promise<T | null>;
  findAll(): Promise<T[] | null>;
  update(id: string, obj: Partial<T>): Promise<T>;
  upsert(obj: T, id?: string): Promise<T>;
  delete(id: string): Promise<void>;
}

export type FirestoreDocument = firestore.DocumentData & Timestamped;

export interface FirestoreRepositoryConstructor<T> {
  new (
    collectionId: string,
    classType: ClassType<T>,
    firestoreClient: firestore.Firestore,
    logger: AppLogger,
  );
}

@Injectable()
export class FirestoreRepositoryFactory {
  constructor(
    @Inject(di_keys.LogFactory) private readonly logFactory: LogFactory,
    @Inject(di_keys.FirestoreClient)
    private readonly firestoreClient: firestore.Firestore,
  ) {}

  manufacture<T extends FirestoreDocument>(
    collectionId: string,
    classType: ClassType<T>,
    repoImplementation: FirestoreRepositoryConstructor<T> = FirestoreRepository,
  ) {
    return new repoImplementation(
      collectionId,
      classType,
      this.firestoreClient,
      this.logFactory(repoImplementation.name),
    );
  }
}

export class FirestoreRepository<T extends FirestoreDocument> implements Repository<T> {
  protected readonly collection: firestore.CollectionReference;

  constructor(
    collectionId: string,
    protected readonly classType: ClassType<T>,
    protected readonly firestoreClient: firestore.Firestore,
    protected readonly logger: AppLogger,
  ) {
    this.collection = firestoreClient.collection(collectionId);
  }

  protected async adaptFirestoreData(firestoreObj: DocumentSnapshot) {
    const rawData = this.parseTimestamp(firestoreObj.data());

    rawData.updatedAt = rawData.updatedAt || firestoreObj.updateTime.toDate();
    rawData.createdAt = rawData.createdAt || firestoreObj.createTime.toDate();
    rawData.id = rawData.id || firestoreObj.id;

    return await transformAndValidate(this.classType, rawData);
  }

  private parseTimestamp = (obj: DocumentData): DocumentData => {
    Object.keys(obj).forEach(key => {
      if (!obj[key]) return;
      if (typeof obj[key] === 'object' && 'toDate' in obj[key]) {
        obj[key] = obj[key].toDate();
      } else if (typeof obj[key] === 'object') {
        this.parseTimestamp(obj[key]);
      }
    });

    return obj;
  };

  public async create(obj: T): Promise<T> {
    try {
      const docRef = await this.collection.add(obj);
      const storedObj = await docRef.get();
      return await this.adaptFirestoreData(storedObj);
    } catch (err) {
      this.logger.error({err}, 'Error creating new firestore doc');
      throw new Error('Error creating new firestore doc');
    }
  }

  public async findOne(id: string): Promise<T | null> {
    try {
      const doc = await this.collection.doc(id).get();
      return doc !== null ? await this.adaptFirestoreData(doc) : null;
    } catch (err) {
      this.logger.error({err}, 'Error finding firestore doc');
      throw new Error('Error finding firestore doc');
    }
  }

  public async findAll(): Promise<T[]> {
    try {
      const allDocs = (await this.collection.get()).docs;
      return await Promise.all(
        allDocs.map(async doc => {
          return await this.adaptFirestoreData(doc);
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
      await docRef.update(obj);
      const doc = await docRef.get();
      return await this.adaptFirestoreData(doc);
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
