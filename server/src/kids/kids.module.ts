import {CommandBus, EventBus, CQRSModule} from '@nestjs/cqrs';
import {CommandHandlers} from './commands/handlers';
import {EventHandlers} from './events/handlers';
import {KidsController} from './kids.controller';
import {KidsService} from './kids.service';
import {OnModuleInit, Module, Inject} from '@nestjs/common';
import {ModuleRef} from '@nestjs/core';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Kid} from './kid.entity';
import {KidEvent} from './events/kid-event.entity';
import {KidEventFactory} from './events/kid-event.factory';
import {KidAggregateRootImpl} from './models/kid.model';
import {InMemoryDb, DexieInMemoryDb} from './projections/in-memory-db';
import {KidsCqrsService} from './kids-cqrs.service';
import {di_keys} from '../common/di-keys';
import {FirestoreRepositoryFactory} from '../persistance/firestore-repository.factory';
import {PersistanceModule} from '../persistance/persistance.module';
import {kidLocationProjectionRepositoryFactory} from './projections/kid-location-repository';
import {kidHistoryDayProjectionRepositoryFactory} from './projections';

export const ProjectionProviders = [
  {
    provide: di_keys.KidLocationsProj,
    useFactory: kidLocationProjectionRepositoryFactory,
    inject: [FirestoreRepositoryFactory],
  },
  {
    provide: di_keys.KidHistoryDayProj,
    useFactory: kidHistoryDayProjectionRepositoryFactory,
    inject: [FirestoreRepositoryFactory],
  },
];

@Module({
  imports: [
    CQRSModule,
    TypeOrmModule.forFeature([Kid]),
    TypeOrmModule.forFeature([KidEvent]),
    PersistanceModule,
  ],
  controllers: [KidsController],
  providers: [
    {provide: di_keys.InMemoryDb, useClass: DexieInMemoryDb},
    {provide: di_keys.AggregateRoot, useClass: KidAggregateRootImpl},
    {provide: di_keys.EventFactory, useClass: KidEventFactory},
    KidsCqrsService,
    KidsService,
    ...EventHandlers,
    ...CommandHandlers,
    ...ProjectionProviders,
    FirestoreRepositoryFactory,
  ],
})
export class KidsModule implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly command$: CommandBus,
    private readonly event$: EventBus,
    private readonly kidsCqrsService: KidsCqrsService,
    @Inject(di_keys.InMemoryDb)
    private readonly inMemoryDb: InMemoryDb,
  ) {}

  async onModuleInit() {
    this.command$.setModuleRef(this.moduleRef);
    this.event$.setModuleRef(this.moduleRef);

    this.event$.register(EventHandlers);
    this.command$.register(CommandHandlers);

    await this.inMemoryDb.delete();
    await this.inMemoryDb.open();

    // await this.kidsCqrsService.loadEventsFromDay();
  }
}
