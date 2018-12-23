import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CheckInKidDto } from './interfaces/check-in-kid-dto.interface';
import { CheckInCommand } from './commands/impl/check-in.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Kid } from './kid.entity';
import { Repository } from 'typeorm';

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
}