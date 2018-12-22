import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CheckInKidDto } from './interfaces/check-in-kid-dto.interface';
import { CheckInCommand } from './commands/impl/check-in.command';

@Injectable()
export class KidsService {
  constructor(private readonly commandBus: CommandBus) {}

  async checkIn(kidId: string, checkInKidDto: CheckInKidDto) {
    return await this.commandBus.execute(
      new CheckInCommand(kidId, checkInKidDto.locationId),
    );
  }
}