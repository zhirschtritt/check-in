import {EventType} from './kid-event.interface';

export interface KidRO {
  id: number;
  firstName: string;
  lastName: string;
  dob: Date;
}

export interface KidLocationRO {
  eventName: EventType;
  locationId?: string;
  kidId: string;
}
