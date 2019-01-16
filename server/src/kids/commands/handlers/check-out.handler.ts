import {EventPublisher, ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {KidAggregateRoot} from '../../models/kid.model';
import {Inject} from '@nestjs/common';
import {CheckOutCommand} from '../impl/check-out.command';
import {LoggerFactory, AppLogger} from 'src/common/logger';

@CommandHandler(CheckOutCommand)
export class CheckOutHandler implements ICommandHandler<CheckOutCommand> {
  private readonly logger: AppLogger;
  constructor(
    private readonly publisher: EventPublisher,
    @Inject('KidAggregateRoot')
    private readonly kidAggregateRoot: KidAggregateRoot,
  ) {
    this.logger = LoggerFactory('CheckOutHandler');
  }

  async execute(command: CheckOutCommand, resolve: (value?) => any) {
    this.logger.log({command}, 'Handling check-out command');

    const {kidId} = command;
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
