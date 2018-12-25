import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {Timestamps} from '../shared/timestamps';

@Entity()
export class KidEntity extends Timestamps {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({type: 'date'})
  dob: Date;
}
