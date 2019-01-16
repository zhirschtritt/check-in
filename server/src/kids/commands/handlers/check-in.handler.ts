import {
  EventPublisher,
  ICommandHandler,
  CommandHandler,
  IEvent,
  AggregateRoot,
} from '@nestjs/cqrs';
import {CheckInCommand} from '../impl/check-in.command';
import {KidAggregateRoot} from '../../models/kid.model';
import {Inject} from '@nestjs/common';
import {AppLogger, LoggerFactory} from 'src/common/logger';

@CommandHandler(CheckInCommand)
export class CheckInHandler implements ICommandHandler<CheckInCommand> {
  private readonly logger: AppLogger;
  constructor(
    private readonly publisher: EventPublisher,
    @Inject('KidAggregateRoot')
    private readonly kidAggregateRoot: KidAggregateRoot,
  ) {
    this.logger = LoggerFactory('CheckInHandler');
  }

  async execute(command: CheckInCommand, resolve: (value?) => void) {
    this.logger.debug({command}, 'Handling check-in command');

    const {kidId, locationId} = command;
    const kid = this.publisher.mergeObjectContext(this.kidAggregateRoot);

    try {
      const event = await kid.checkIn(kidId, locationId);
      resolve({event});
    } catch (err) {
      this.logger.error({error: err.message}, 'Error creating event');
      resolve({error: err.message});
    }
  }
}
