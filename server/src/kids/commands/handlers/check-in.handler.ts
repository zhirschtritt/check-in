import {EventPublisher, ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {CheckInCommand} from '../impl/check-in.command';
import {KidAggreagateRoot} from '../../models/kid.model';

@CommandHandler(CheckInCommand)
export class CheckInHandler implements ICommandHandler<CheckInCommand> {
  constructor(private readonly publisher: EventPublisher) {}

  async execute(command: CheckInCommand, resolve: (value?) => void) {
    console.log(`CheckInCommand handled: ${JSON.stringify(command, null, 2)}`); // tslint:disable-line
    const {kidId, locationId} = command;
    const kid = this.publisher.mergeObjectContext(new KidAggreagateRoot());

    kid.checkIn(kidId, locationId);
    kid.commit();

    resolve();
  }
}
