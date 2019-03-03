import {Model} from '../interfaces';

export interface RawKidLocation {
  kidId: string;
  locationId: string;
}

export interface KidLocation extends RawKidLocation, Model {}

export class KidLocation implements KidLocation {}
