import {Injectable, HttpException, HttpStatus} from '@nestjs/common';
import {Repository, DeleteResult} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {CommandBus, EventPublisher} from '@nestjs/cqrs';
import {validate} from 'class-validator';
import {CheckInCommand} from './commands/impl/check-in.command';
import {Kid as KidEntity} from './kid.entity';
import {KidEvent, EventType} from './events/event.entity';
import {CreateKidDto, CheckInKidDto} from './dto';
import {KidRO, KidLocationRO} from './interfaces/kid.interface';
import {KidCheckedInEvent} from './events/impl/kid-checked-in.event';
import {LoadFromHistory} from './commands/impl/load-from-history.command';

@Injectable()
export class KidsService {
  constructor(
    @InjectRepository(KidEntity)
    private readonly kidRepository: Repository<KidEntity>,
    @InjectRepository(KidEvent)
    private readonly eventRepository: Repository<KidEvent>,
    private readonly commandBus: CommandBus,
  ) {}

  async checkIn(kidId: string, checkInKidDto: CheckInKidDto) {
    return await this.commandBus.execute(
      new CheckInCommand(kidId, checkInKidDto.locationId),
    );
  }

  async loadEventsFromDay() {
    // tslint:disable-next-line:no-console
    console.log('loading all events');

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const allEventsFromDay = await this.eventRepository
      .createQueryBuilder('kid_event')
      .where('kid_event.created_at > :startOfDay', {startOfDay})
      .getMany();

    return await this.commandBus.execute(new LoadFromHistory(allEventsFromDay));
  }

  async getCurrentLocation(kidId: string): Promise<KidLocationRO> {
    const lastLocationEvent = await this.eventRepository
      .createQueryBuilder('kid_event')
      .orderBy('kid_event.created_at', 'DESC')
      .where('kid_event.name = :eventName', {eventName: EventType.CHECK_IN})
      .where(`kid_event.data ::jsonb @> :kid`, {kid: {kidId}})
      .getOne();

    const checkInData = lastLocationEvent.data as KidCheckedInEvent;

    return {
      eventName: EventType[lastLocationEvent.name],
      kidId,
      locationId: checkInData.locationId,
    };
  }

  async findAll(): Promise<KidRO[]> {
    const allKids = await this.kidRepository.find();
    return allKids.map(kid => this.kidEntityToResponseObject(kid));
  }

  async findOne(id: string): Promise<KidRO> {
    try {
      const kidEntity = await this.kidRepository.findOne({id});
      return this.kidEntityToResponseObject(kidEntity);
    } catch (error) {
      throw new HttpException(
        {message: 'Entiy not found', errors: [error]},
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(dto: CreateKidDto): Promise<KidRO> {
    // check uniqueness of firstName, lastName, dob
    const {firstName, lastName, dob} = dto;
    const qb = await this.kidRepository
      .createQueryBuilder('kid')
      .where('kid.first_name = :firstName', {firstName})
      .andWhere('kid.last_name = :lastName', {lastName})
      .andWhere('kid.dob = :dob', {dob: new Date(dob)});

    const kid = await qb.getOne();

    let errors;

    if (kid) {
      errors = {
        duplicate_entity: 'First name, last name, and dob must be unique',
      };
      throw new HttpException(
        {message: 'Input data validation failed', errors},
        HttpStatus.BAD_REQUEST,
      );
    }

    // create new user
    const newKid = new KidEntity();
    newKid.first_name = firstName;
    newKid.last_name = lastName;
    newKid.dob = new Date(dob);

    errors = await validate(newKid);
    if (errors.length > 0) {
      const _errors = {kid: 'Userinput is not valid.'};
      throw new HttpException(
        {message: 'Input data validation failed', _errors},
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const newKidEntity = await this.kidRepository.save(newKid);
      return this.kidEntityToResponseObject(newKidEntity);
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.kidRepository.delete({id});
  }

  private kidEntityToResponseObject(kid: KidEntity): KidRO {
    const responseObject: KidRO = {
      id: +kid.id,
      firstName: kid.first_name,
      lastName: kid.last_name,
      dob: kid.dob,
    };

    return responseObject;
  }
}
