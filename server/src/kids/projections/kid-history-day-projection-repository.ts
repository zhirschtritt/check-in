import {KidHistoryEvent, KidHistoryDay} from '@core';
import {
  FirestoreRepository,
  FirestoreRepositoryFactory,
} from '../../persistance/firestore-repository.factory';
import {firestore} from 'firebase-admin';

export const kidHistoryDayProjectionRepositoryFactory = (
  firestoreRepoFactory: FirestoreRepositoryFactory,
) => {
  return firestoreRepoFactory.manufacture(
    'kid-history-day-projection',
    KidHistoryDay,
    KidHistoryDayProjectionRepository,
  );
};

export interface KidHistoryDayProjectionRepository extends FirestoreRepository<KidHistoryDay> {
  appendEventByKidId(kidId: string, event: KidHistoryEvent): Promise<KidHistoryDay>;
  findByKidId(kidId: string): Promise<KidHistoryDay | undefined>;
}
export class KidHistoryDayProjectionRepository extends FirestoreRepository<KidHistoryDay>
  implements KidHistoryDayProjectionRepository {
  async appendEventByKidId(kidId: string, event: KidHistoryEvent) {
    const exsistingKidHistory = await this.findByKidId(kidId);
    event.timestamp = Date.now();

    if (exsistingKidHistory) {
      return await this.update(exsistingKidHistory.id, {
        history: firestore.FieldValue.arrayUnion(event) as any,
      });
    } else {
      return await this.create({
        kidId,
        history: firestore.FieldValue.arrayUnion(event) as any,
      });
    }
  }
  async findByKidId(kidId: string) {
    const queryRes = await this.collection.where('kidId', '==', kidId).get();

    if (queryRes.empty) {
      return undefined;
    }

    return await this.adaptFirestoreData(queryRes.docs[0]);
  }
}

// export class KidHistoryDayProjectionImpl implements KidHistoryDayProjection {
//   private readonly kidHistoryDayTable: Dexie.Table<KidHistoryDay, number>;
//   private readonly logger: AppLogger;
//   constructor(
//     @Inject(di_keys.LogFactory) logFactory: LogFactory,
//     @Inject(di_keys.InMemoryDb) private readonly inMemoryDb: InMemoryDb,
//   ) {
//     this.kidHistoryDayTable = inMemoryDb.kidHistoryDay;
//     this.logger = logFactory('KidLocationProjection');
//   }

//   async appendEvent(kidId: string, incomingEvent: KidHistoryEvent) {
//     return this.inMemoryDb.transaction('rw', this.kidHistoryDayTable, async () => {
//       const kidHistory = await this.kidHistoryDayTable
//         .where('kidId')
//         .equals(kidId)
//         .first();

//       incomingEvent.timestamp = new Date();

//       if (kidHistory) {
//         kidHistory.history.push(incomingEvent);
//         return await this.kidHistoryDayTable.update(kidHistory.id, {
//           history: kidHistory.history,
//         });
//       } else {
//         return await this.kidHistoryDayTable.add({
//           kidId,
//           history: [incomingEvent],
//         });
//       }
//     });
//   }

//   async findAll() {
//     return await this.kidHistoryDayTable.toArray();
//   }

//   async findOne(kidId: string) {
//     return await this.kidHistoryDayTable
//       .where('kidId')
//       .equals(kidId)
//       .first();
//   }

//   async debug() {
//     const kidHistoryDayProjection = await this.kidHistoryDayTable.toArray();

//     this.logger.debug({kidHistoryDayProjection}, 'Updating kidLocation aggregate');
//   }
// }
