import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export type EventType = 'CHECK_IN' | 'LOCATED';

@Entity()
export class KidEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: EventType;

  @Column('simple-json')
  data: object;

  @CreateDateColumn({type: 'timestamp'})
  created_at: Date;
}
