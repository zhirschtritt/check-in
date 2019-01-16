import {CommandBus, EventBus, CQRSModule} from '@nestjs/cqrs';
import {CommandHandlers} from './commands/handlers';
import {EventHandlers} from './events/handlers';
import {KidsController} from './kids.controller';
import {KidsService} from './kids.service';
import {OnModuleInit, Module} from '@nestjs/common';
import {ModuleRef} from '@nestjs/core';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Kid} from './kid.entity';
import {KidEvent} from './events/kid-event.entity';
import {KidEventFactory} from './events/kid-event.factory';
import {KidAggregateRoot} from './models/kid.model';
import {InMemoryDb} from './projections/in-memory-db';
import {AppLogger, LoggerFactory} from 'src/common/logger';

const _inMemoryDb = new InMemoryDb();

const inMemoryDb = {
  provide: 'inMemoryDb',
  useValue: _inMemoryDb,
};

const ProjectionDbTables = _inMemoryDb.tables.map(table => {
  return {
    provide: table.name,
    useValue: table,
  };
});

// const KidAggregateRootProvider = {
//   provide: 'KidAggregateRoot',
//   useFactory: (eventFactory: KidEventFactory, projectionsDb: InMemoryDb) => {
//     return new KidAggregateRoot(eventFactory, projectionsDb);
//   },
//   inject: [KidEventFactory, inMemoryDb],
// };

@Module({
  imports: [
    CQRSModule,
    TypeOrmModule.forFeature([Kid]),
    TypeOrmModule.forFeature([KidEvent]),
  ],
  controllers: [KidsController],
  providers: [
    KidEventFactory,
    KidAggregateRoot,
    ...EventHandlers,
    ...CommandHandlers,
    ...ProjectionDbTables,
    inMemoryDb,
    KidsService,
  ],
})
export class KidsModule implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly command$: CommandBus,
    private readonly event$: EventBus,
    private readonly kidsService: KidsService,
  ) {}

  async onModuleInit() {
    this.command$.setModuleRef(this.moduleRef);
    this.event$.setModuleRef(this.moduleRef);

    this.event$.register(EventHandlers);
    this.command$.register(CommandHandlers);

    await _inMemoryDb.delete();
    await _inMemoryDb.open();

    await this.kidsService.loadEventsFromDay();
  }
}
