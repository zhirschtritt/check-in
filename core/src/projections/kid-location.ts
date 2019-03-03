import {FirestoreTimestamp} from '../interfaces/firestore-timestamps';

export interface RawKidLocation {
  id?: number;
  kidId: string;
  locationId: string;
}

export interface KidLocation extends RawKidLocation, FirestoreTimestamp {}
