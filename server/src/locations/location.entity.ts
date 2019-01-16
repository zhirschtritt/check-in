import {Entity, PrimaryColumn} from 'typeorm';
import {Timestamps} from 'src/common/timestamps';

@Entity()
export class Location extends Timestamps {
  @PrimaryColumn()
  name: string;
}
