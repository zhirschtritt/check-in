import {
  FirestoreRepositoryFactory,
  FirestoreRepository,
} from '../../persistance/firestore-repository.factory';
import {KidLocation} from '@core';

export const kidLocationProjectionRepositoryFactory = (
  firestoreRepoFactory: FirestoreRepositoryFactory,
) => {
  return firestoreRepoFactory.manufacture(
    'kid-location-projection',
    KidLocation,
    KidLocationProjectionRepository,
  );
};

export interface KidLocationProjectionRepository extends FirestoreRepository<KidLocation> {
  findByKidId(kidId: string): Promise<KidLocation> | undefined;
}
export class KidLocationProjectionRepository extends FirestoreRepository<KidLocation>
  implements KidLocationProjectionRepository {
  async findByKidId(kidId: string) {
    const queryRes = await this.collection.where('kidId', '==', kidId).get();

    if (queryRes.empty) {
      return undefined;
    }

    return await this.adaptFirestoreData(queryRes.docs[0]);
  }
}
