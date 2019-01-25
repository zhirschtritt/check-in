import {EventPublisher, ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {KidAggregateRoot} from '../../models/kid.model';
import {CheckOutCommand} from '../impl/check-out.command';
import {LogFactory, AppLogger} from 'src/common/logger';
import {Inject} from '@nestjs/common';
import {di_keys} from '../../../common/di-keys';

@CommandHandler(CheckOutCommand)
export class CheckOutHandler implements ICommandHandler<CheckOutCommand> {
  private readonly logger: AppLogger;
  constructor(
    @Inject(di_keys.LogFactory) logFactory: LogFactory,
    private readonly publisher: EventPublisher,
    @Inject(di_keys.AggregateRoot)
    private readonly kidAggregateRoot: KidAggregateRoot,
  ) {
    this.logger = logFactory('CheckOutHandler');
  }

  async execute(checkOutCommand: CheckOutCommand, resolve: (value?) => any) {
    this.logger.debug({checkOutCommand}, 'Handling check-out command');

    const {kidId} = checkOutCommand;
    const kid = this.publisher.mergeObjectContext(this.kidAggregateRoot);

    try {
      const event = await kid.checkOut(kidId);
      resolve({event});
    } catch (err) {
      this.logger.error({error: err.message}, 'Error creating event');
      resolve({error: err.message});
    }
  }
}
