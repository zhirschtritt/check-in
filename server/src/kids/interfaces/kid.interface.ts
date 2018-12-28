import {Location} from '../../locations/location.entity';
import {EventType} from '../events/event.entity';

export interface KidRO {
  id: number;
  firstName: string;
  lastName: string;
  dob: Date;
  currentLocation?: Location;
}

export interface KidLocationRO {
  eventName: EventType;
  locationId?: string;
  kidId: string;
}
