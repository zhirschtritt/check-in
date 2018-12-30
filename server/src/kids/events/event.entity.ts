import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export enum EventType {
  CHECK_IN = 'CHECK_IN',
}

@Entity()
export class KidEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('simple-json')
  data: object;

  @CreateDateColumn({type: 'timestamp'})
  created_at: Date;
}
