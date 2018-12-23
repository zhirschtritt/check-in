import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Kid {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  dob: Date;
}