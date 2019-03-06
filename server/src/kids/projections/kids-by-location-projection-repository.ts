import {KidsByLocation} from '@core';
import {
  FirestoreRepository,
  FirestoreRepositoryFactory,
} from '../../persistance/firestore-repository.factory';
import {firestore} from 'firebase-admin';
import {Transaction, QueryDocumentSnapshot} from '@google-cloud/firestore';

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
    const storedLocationRef = await this.collection.where('locationId', '==', locationId).get();

    if (storedLocationRef.empty) {
      // if no existing location in projection, create new and add kidId
      return await this.create({locationId, kids: firestore.FieldValue.arrayUnion(kidId) as any});
    }

    return await this.update(storedLocationRef.docs[0].id, {
      kids: firestore.FieldValue.arrayUnion(kidId) as any,
    });
  }

  async removeKidFromLocation(kidId: string) {
    const currentLocationQueryResult = await getLocationByKidId(kidId, this.collection);

    if (currentLocationQueryResult.empty) {
      this.logger.warn(
        {kidId},
        'Failed to remove kid from location, could not find matching location ref',
      );
      return;
    }

    return await this.removeKidAndDeleteLocationIfLast(currentLocationQueryResult.docs[0], kidId);
  }

  async moveKidToLocation(kidId: string, locationId: string) {
    const currentLocationQuery = await getLocationByKidId(kidId, this.collection);
    const destinationLocationQuery = await getLocationByLocId(locationId, this.collection);

    if (
      !currentLocationQuery.empty &&
      !destinationLocationQuery.empty &&
      currentLocationQuery.docs[0].isEqual(destinationLocationQuery.docs[0])
    ) {
      this.logger.warn(
        {kidId, locationId},
        'No action, destination location equal to current location',
      );
      return;
    }

    // if the destination location doesn't exist, create new record, else append kid to record
    if (destinationLocationQuery.empty) {
      await this.create({
        locationId,
        kids: firestore.FieldValue.arrayUnion(kidId) as any,
      });
    } else {
      await this.update(destinationLocationQuery.docs[0].id, {
        kids: firestore.FieldValue.arrayUnion(kidId) as any,
      });
    }

    // remove kid from current location
    if (!currentLocationQuery.empty) {
      return this.removeKidAndDeleteLocationIfLast(currentLocationQuery.docs[0], kidId);
    }
  }

  private async removeKidAndDeleteLocationIfLast(
    currentLocationDoc: QueryDocumentSnapshot,
    kidId: string,
  ) {
    const remainingKidsAtLocation = currentLocationDoc.data().kids.length;
    if (remainingKidsAtLocation <= 1) {
      return await this.delete(currentLocationDoc.id);
    } else {
      return await this.update(currentLocationDoc.id, {
        kids: firestore.FieldValue.arrayRemove(kidId) as any,
      });
    }
  }
}

async function getLocationByKidId(kidId: string, collection: firestore.CollectionReference) {
  return await collection
    .where('kids', 'array-contains', kidId)
    .limit(1)
    .get();
}

async function getLocationByLocId(locationId: string, collection: firestore.CollectionReference) {
  return await collection
    .where('locationId', '==', locationId)
    .limit(1)
    .get();
}
