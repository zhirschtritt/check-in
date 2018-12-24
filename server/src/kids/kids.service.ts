import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandBus } from '@nestjs/cqrs';
import { CheckInCommand } from './commands/impl/check-in.command';
import { Kid } from './kid.entity';
import { CreateKidDto, CheckInKidDto } from './dto';
import { validate } from 'class-validator';

@Injectable()
export class KidsService {
  constructor(
    @InjectRepository(Kid)
    private readonly kidRepository: Repository<Kid>,
    private readonly commandBus: CommandBus,
    ) {}

  async checkIn(kidId: string, checkInKidDto: CheckInKidDto) {
    return await this.commandBus.execute(
      new CheckInCommand(kidId, checkInKidDto.locationId),
    );
  }

  async findAll(): Promise<Kid[]> {
    return await this.kidRepository.find();
  }

  async create(dto: CreateKidDto): Promise<Kid> {
    // check uniqueness of firstName, lastName, dob
    const {firstName, lastName, dob} = dto;
    const qb = await this.kidRepository
      .createQueryBuilder('kid')
      .where('kid.firstName = :firstName', { firstName })
      .andWhere('kid.lastName = :lastName', { lastName })
      .andWhere('kid.dob = :dob', { dob });

    const kid = await qb.getOne();

    if (kid) {
      const createKidErrors = {unique: 'First name, last name, and dob must be unique '};
      throw new HttpException({message: 'Input data validation failed', createKidErrors}, HttpStatus.BAD_REQUEST);

    }

    // create new user
    const newKid = new Kid();
    newKid.first_name = firstName;
    newKid.last_name = lastName;
    newKid.dob = dob;

    const errors = await validate(newKid);
    if (errors.length > 0) {
      const _errors = {kid: 'Userinput is not valid.'};
      throw new HttpException({message: 'Input data validation failed', _errors}, HttpStatus.BAD_REQUEST);
    } else {
      return this.kidRepository.save(newKid);
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.kidRepository.delete({id});
  }
}