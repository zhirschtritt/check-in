import {EventPublisher, ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {CheckInCommand} from '../impl/check-in.command';
import {KidAggregateRoot} from '../../models/kid.model';
import {AppLogger, LogFactory} from 'src/common/logger';
import {Inject} from '@nestjs/common';
import {di_keys} from '../../../common/di-keys';

@CommandHandler(CheckInCommand)
export class CheckInHandler implements ICommandHandler<CheckInCommand> {
  private readonly logger: AppLogger;
  constructor(
    @Inject(di_keys.LogFactory) logFactory: LogFactory,
    private readonly publisher: EventPublisher,
    @Inject(di_keys.AggregateRoot)
    private readonly kidAggregateRoot: KidAggregateRoot,
  ) {
    this.logger = logFactory('CheckInHandler');
  }

  async execute(checkInCommand: CheckInCommand, resolve: (value?) => void) {
    this.logger.debug({checkInCommand}, 'Handling check-in command');

    const {kidId, locationId} = checkInCommand;
    const kid = this.publisher.mergeObjectContext(this.kidAggregateRoot);

    try {
      const event = await kid.checkIn(kidId, locationId);
      resolve({event});
    } catch (error) {
      this.logger.error({error}, 'Error creating event');
      resolve(Promise.reject(error));
    }
  }
}
