import {KidsByLocation} from '@core';
import {
  FirestoreRepository,
  FirestoreRepositoryFactory,
} from '../../persistance/firestore-repository.factory';
import {firestore} from 'firebase-admin';
import {Transaction} from '@google-cloud/firestore';

export const kidsByLocationProjectionRepositoryFactory = (
  firestoreRepoFactory: FirestoreRepositoryFactory,
) => {
  return firestoreRepoFactory.manufacture(
    'kids-by-location-projection',
    KidsByLocation,
    KidsByLocationProjectionRepository,
  );
};

export interface KidsByLocationProjectionRepository extends FirestoreRepository<KidsByLocation> {
  addKidToLocation(kidId: string, locId: string): Promise<KidsByLocation>;
  removeKidFromLocation(kidId: string, locationId: string): Promise<KidsByLocation>;
  moveKidToLocation(kidId: string, locationId: string): Promise<KidsByLocation>;
}
export class KidsByLocationProjectionRepository extends FirestoreRepository<KidsByLocation>
  implements KidsByLocationProjectionRepository {
  async addKidToLocation(kidId: string, locationId: string) {
    let locationRecord: KidsByLocation;
    const storedLocationRef = await this.collection.where('locationId', '==', locationId).get();

    if (storedLocationRef.empty) {
      locationRecord = {
        locationId,
        kids: firestore.FieldValue.arrayUnion(kidId) as any,
      };

      return await this.create(locationRecord);
    }

    return await this.update(storedLocationRef.docs[0].id, {
      kids: firestore.FieldValue.arrayUnion(kidId) as any,
    });
  }

  async removeKidFromLocation(kidId: string) {
    const storedLocationRef = await this.collection
      .where('kids', 'array-contains', kidId)
      .limit(1)
      .get();

    if (storedLocationRef.empty) {
      this.logger.warn(
        {kidId},
        'Failed to remove kid from location, could not find matching location ref',
      );
      return;
    }

    return await this.update(storedLocationRef.docs[0].id, {
      kids: firestore.FieldValue.arrayRemove(kidId) as any,
    });
  }

  async moveKidToLocation(kidId: string, locationId: string) {
    return this.firestoreClient.runTransaction(async (transaction: Transaction) => {
      const currentLocationQueryResult = await this.collection
        .where('kids', 'array-contains', kidId)
        .limit(1)
        .get();

      if (currentLocationQueryResult && !currentLocationQueryResult.empty) {
        transaction.update(currentLocationQueryResult.docs[0].ref, {
          kids: firestore.FieldValue.arrayRemove(kidId),
        });
      }

      const destinationLocationQueryResult = await this.collection
        .where('locationId', '==', locationId)
        .limit(1)
        .get();

      if (destinationLocationQueryResult && !destinationLocationQueryResult.empty) {
        return await transaction.update(destinationLocationQueryResult.docs[0].ref, {
          kids: firestore.FieldValue.arrayUnion(kidId) as any,
        });
      }

      return await this.create({
        locationId,
        kids: firestore.FieldValue.arrayUnion(kidId) as any,
      });
    });
  }
}
