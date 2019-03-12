import {Model} from '../interfaces';

export interface RawKidsByLocation {
  locationId: string;
  kids: string[];
}

export interface KidsByLocation extends RawKidsByLocation, Model {}

export class KidsByLocation implements KidsByLocation {}
