import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn} from 'typeorm';
import {EventType} from '@core';

@Entity()
export class KidEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'varchar'})
  type: EventType;

  @Column('simple-json')
  data: object;

  @CreateDateColumn({type: 'timestamp'})
  created_at: Date;
}
