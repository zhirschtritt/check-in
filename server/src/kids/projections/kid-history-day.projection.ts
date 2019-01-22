import {InMemoryDb} from './in-memory-db';
import Dexie from 'dexie';
import {Inject} from '@nestjs/common';
import {LogFactory, AppLogger} from '../../common/logger';
import {EventType} from '../interfaces/kid-event.interface';
import {di_keys} from '../../common/di-keys';

export interface KidHistoryDay {
  id?: number;
  kidId: string;
  history: KidHistoryEvent[];
}

export interface KidHistoryEvent {
  eventType: EventType;
  timestamp?: Date;
  locationId?: string;
}

export interface KidHistoryDayProjection {
  appendEvent(kidId: string, event: KidHistoryEvent): Promise<number>;
  debug(): Promise<void>;
  findAll(): Promise<KidHistoryDay[]>;
  findOne(kidId: string): Promise<KidHistoryDay>;
}

export class KidHistoryDayProjectionAdapter implements KidHistoryDayProjection {
  private readonly kidHistoryDayTable: Dexie.Table<KidHistoryDay, number>;
  private readonly logger: AppLogger;
  constructor(
    @Inject(di_keys.LogFactory) logFactory: LogFactory,
    @Inject(di_keys.InMemoryDb) private readonly inMemoryDb: InMemoryDb,
  ) {
    this.kidHistoryDayTable = inMemoryDb.kidHistoryDay;
    this.logger = logFactory('KidLocationProjection');
  }

  async appendEvent(kidId: string, incomingEvent: KidHistoryEvent) {
    return this.inMemoryDb.transaction(
      'rw',
      this.kidHistoryDayTable,
      async () => {
        const kidHistory = await this.kidHistoryDayTable
          .where('kidId')
          .equals(kidId)
          .first();

        incomingEvent.timestamp = new Date();

        if (kidHistory) {
          kidHistory.history.push(incomingEvent);
          return await this.kidHistoryDayTable.update(kidHistory.id, {
            history: kidHistory.history,
          });
        } else {
          return await this.kidHistoryDayTable.add({
            kidId,
            history: [incomingEvent],
          });
        }
      },
    );
  }

  async findAll() {
    return await this.kidHistoryDayTable.toArray();
  }

  async findOne(kidId: string) {
    return await this.kidHistoryDayTable
      .where('kidId')
      .equals(kidId)
      .first();
  }

  async debug() {
    const kidHistoryDayProjection = await this.kidHistoryDayTable.toArray();

    this.logger.debug(
      {kidHistoryDayProjection},
      'Updating kidLocation aggregate',
    );
  }
}
