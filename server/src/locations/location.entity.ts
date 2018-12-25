import {Entity, PrimaryColumn} from 'typeorm';
import {Timestamps} from '../shared/timestamps';

@Entity()
export class Location extends Timestamps {
  @PrimaryColumn()
  name: string;
}
