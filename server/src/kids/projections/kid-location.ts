import {FirestoreTimestamp} from '@core';
import {IsNotEmpty} from 'class-validator';
import {
  FirestoreRepositoryFactory,
  FirestoreRepository,
} from '../../persistance/firestore-repository.factory';

export class KidLocation extends FirestoreTimestamp implements KidLocation {
  public id?: number;
  @IsNotEmpty() public kidId: string;
  @IsNotEmpty() public locationId: string;
}

export class KidLocationProjectionRepository extends FirestoreRepository<KidLocation> {
  async findByKidId(kidId: string) {
    return (await this.collection.where('kidId', '==', kidId).get()).docs[0];
  }
}
