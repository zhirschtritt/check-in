import {EventType} from '../interfaces/kid-event.interface';
import {Model} from '../interfaces/model';

export interface RawKidHistoryDay {
  kidId: string;
  history: KidHistoryEvent[];
}

export interface KidHistoryEvent {
  eventType: EventType;
  timestamp?: Date;
  locationId?: string;
}

export interface KidHistoryDay extends RawKidHistoryDay, Model {}

export class KidHistoryDay implements KidHistoryDay {}
