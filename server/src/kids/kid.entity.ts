import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {Timestamps} from 'src/common/timestamps';

@Entity()
export class Kid extends Timestamps {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({type: 'date'})
  dob: Date;
}
