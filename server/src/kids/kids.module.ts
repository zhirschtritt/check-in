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
import {KidAggregateRootImpl} from './models/kid.model';
import {KidsCqrsService} from './kids-cqrs.service';
import {di_keys} from '../common/di-keys';
import {FirestoreRepositoryFactory} from '../persistance/firestore-repository.factory';
import {PersistanceModule} from '../persistance/persistance.module';
import {
  kidLocationProjectionRepositoryFactory,
  kidHistoryDayProjectionRepositoryFactory,
  kidsByLocationProjectionRepositoryFactory,
} from './projections';

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
  {
    provide: di_keys.KidsByLocationProj,
    useFactory: kidsByLocationProjectionRepositoryFactory,
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
  ) {}

  async onModuleInit() {
    this.command$.setModuleRef(this.moduleRef);
    this.event$.setModuleRef(this.moduleRef);

    this.event$.register(EventHandlers);
    this.command$.register(CommandHandlers);
  }
}
