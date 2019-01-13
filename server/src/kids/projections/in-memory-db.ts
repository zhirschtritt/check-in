// tslint:disable-next-line:no-var-requires
const setGlobalVars = require('indexeddbshim');
import Dexie from 'dexie';
import {Injectable} from '@nestjs/common';

const shim = {};
setGlobalVars(shim, {checkOrigin: false});

const {indexedDB, IDBKeyRange} = shim as any;
Dexie.dependencies.indexedDB = indexedDB;
Dexie.dependencies.IDBKeyRange = IDBKeyRange;

@Injectable()
export class InMemoryDb extends Dexie {
  kidLocations: Dexie.Table<KidLocation, number>;

  constructor() {
    super('InMemoryDatabase');
    const db = this;

    db.version(1).stores({
      kidLocations: '++id, locationId, kidId',
    });
  }
}

export interface KidLocation {
  id?: number;
  locationId: string;
  kidId: string;
}
