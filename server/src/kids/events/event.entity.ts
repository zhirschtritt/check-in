import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export enum EventType {
  checkIn = 'CHECK-IN',
}

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  event_type: string;

  @Column('simple-json')
  data: object;

  @CreateDateColumn({type: 'timestamp'})
  created_at: Date;
}
