import {InMemoryDb} from './in-memory-db';
import Dexie from 'dexie';
import {Inject} from '@nestjs/common';
import {LogFactory, AppLogger} from '../../common/logger';
import {di_keys} from '../../common/di-keys';

export interface KidLocation {
  id?: number;
  kidId: string;
  locationId: string;
  revision?: number;
}

export interface KidLocationProjection {
  upsert(newKidLocation: KidLocation): Promise<number>;
  delete(kidId: string): Promise<void>;
  debug(): Promise<void>;
  findAll(): Promise<KidLocation[]>;
  findOne(kidId: string): Promise<KidLocation>;
}

export class KidLocationProjectionImpl implements KidLocationProjection {
  private readonly kidLocationsTable: Dexie.Table<KidLocation, number>;
  private readonly logger: AppLogger;
  constructor(
    @Inject(di_keys.LogFactory) logFactory: LogFactory,
    @Inject(di_keys.InMemoryDb) private readonly inMemoryDb: InMemoryDb,
  ) {
    this.kidLocationsTable = inMemoryDb.kidLocations;
    this.logger = logFactory('KidLocationProjection');
  }

  async upsert(newKidLocation: KidLocation) {
    return this.inMemoryDb.transaction(
      'rw',
      this.kidLocationsTable,
      async () => {
        const currentLocation = await this.kidLocationsTable
          .where('kidId')
          .equals(newKidLocation.kidId)
          .first();

        if (currentLocation) {
          return await this.kidLocationsTable.update(currentLocation.id, {
            locationId: newKidLocation.locationId,
            revision: currentLocation.revision += 1,
          });
        } else {
          return await this.kidLocationsTable.add(newKidLocation);
        }
      },
    );
  }

  async delete(kidId: string) {
    return this.inMemoryDb.transaction(
      'rw',
      this.kidLocationsTable,
      async () => {
        const kidLocation = await this.kidLocationsTable
          .where('kidId')
          .equals(kidId)
          .first();

        if (kidLocation) {
          return await this.kidLocationsTable.delete(kidLocation.id);
        }
      },
    );
  }

  async findAll() {
    return await this.kidLocationsTable.toArray();
  }

  async findOne(kidId: string) {
    return await this.kidLocationsTable
      .where('kidId')
      .equals(kidId)
      .first();
  }

  async debug() {
    const updatedKidLocations = await this.kidLocationsTable.toArray();

    this.logger.debug({updatedKidLocations}, 'Updating kidLocation aggregate');
  }
}
