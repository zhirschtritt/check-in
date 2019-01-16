import {Entity, CreateDateColumn, UpdateDateColumn} from 'typeorm';

@Entity()
export class Timestamps {
  @CreateDateColumn({type: 'timestamp'})
  created_at: Date;

  @UpdateDateColumn({type: 'timestamp'})
  updated_at: Date;
}