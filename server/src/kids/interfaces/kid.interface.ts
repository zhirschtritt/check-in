import {Location} from '../../locations/location.entity';

export interface KidRO {
  id: number;
  firstName: string;
  lastName: string;
  dob: Date;
  currentLocation?: Location;
}
