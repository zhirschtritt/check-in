// tslint:disable-next-line:no-var-requires
const setGlobalVars = require('indexeddbshim');
import Dexie from 'dexie';
import {Injectable} from '@nestjs/common';
import {KidLocation} from './kid-location.projection';
import {KidHistoryDay} from './kid-history-day.projection';

const shim = {};
setGlobalVars(shim, {checkOrigin: false});

const {indexedDB, IDBKeyRange} = shim as any;
Dexie.dependencies.indexedDB = indexedDB;
Dexie.dependencies.IDBKeyRange = IDBKeyRange;

export interface InMemoryDb extends Dexie {
  kidLocations: Dexie.Table<KidLocation, number>;
  kidHistoryDay: Dexie.Table<KidHistoryDay, number>;
}
@Injectable()
export class DexieInMemoryDb extends Dexie implements InMemoryDb {
  kidLocations: Dexie.Table<KidLocation, number>;
  kidHistoryDay: Dexie.Table<KidHistoryDay, number>;

  constructor() {
    super('InMemoryDatabase');
    const db = this;

    db.version(1).stores({
      kidLocations: '++id, kidId, locationId',
      kidHistoryDay: '++id, kidId',
    });
  }
}
