import {EventType} from '../kid-event.interface';

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
