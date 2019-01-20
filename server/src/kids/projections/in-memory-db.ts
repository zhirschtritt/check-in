// tslint:disable-next-line:no-var-requires
const setGlobalVars = require('indexeddbshim');
import Dexie from 'dexie';
import {Injectable} from '@nestjs/common';
import {KidLocation} from './kid-location.projection';

const shim = {};
setGlobalVars(shim, {checkOrigin: false});

const {indexedDB, IDBKeyRange} = shim as any;
Dexie.dependencies.indexedDB = indexedDB;
Dexie.dependencies.IDBKeyRange = IDBKeyRange;

export interface InMemoryDb extends Dexie {
  kidLocations: Dexie.Table<KidLocation, number>;
}
@Injectable()
export class DexieInMemoryDb extends Dexie implements InMemoryDb {
  kidLocations: Dexie.Table<KidLocation, number>;

  constructor() {
    super('InMemoryDatabase');
    const db = this;

    db.version(1).stores({
      kidLocations: '++id, kidId, locationId',
    });
  }
}
