import * as clc from 'cli-color';
import { EventPublisher, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { KidRepository } from '../../repository/kid.repository';
import { CheckInCommand } from '../impl/check-in.command';

@CommandHandler(CheckInCommand)
export class CheckInHandler implements ICommandHandler<CheckInCommand> {
  constructor(
    private readonly repository: KidRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CheckInCommand, resolve: (value?) => void) {
    console.log(clc.greenBright('CheckInCommand handled...')); // tslint:disable-line

    const { kidId, locationId } = command;
    const kid = this.publisher.mergeObjectContext(
      await this.repository.findOneById(+kidId),
    );
    kid.checkIn(locationId);
    kid.commit();
    resolve();
  }
}