import * as clc from 'cli-color';
import {EventPublisher, ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {CheckInCommand} from '../impl/check-in.command';
import {KidsService} from '../../kids.service';
import {Kid} from '../../models/kid.model';

@CommandHandler(CheckInCommand)
export class CheckInHandler implements ICommandHandler<CheckInCommand> {
  constructor(
    private readonly kidService: KidsService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CheckInCommand, resolve: (value?) => void) {
    console.log(clc.greenBright('CheckInCommand handled...')); // tslint:disable-line
    const {kidId, locationId} = command;
    const kid = this.publisher.mergeObjectContext(new Kid(kidId));

    kid.checkIn(locationId);
    kid.commit();
    resolve();
  }
}
