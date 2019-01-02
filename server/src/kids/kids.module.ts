import {CommandBus, EventBus, CQRSModule} from '@nestjs/cqrs';
import {CommandHandlers} from './commands/handlers';
import {EventHandlers} from './events/handlers';
import {KidsController} from './kids.controller';
import {KidsService} from './kids.service';
import {OnModuleInit, Module, Inject} from '@nestjs/common';
import {ModuleRef} from '@nestjs/core';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Kid} from './kid.entity';
import {KidEvent} from './events/event.entity';
import {Loki} from '@lokidb/loki';
import {ProjectionStorage} from './projections/projection-storage';

const lokiDB = {
  provide: 'LokiDB',
  useFactory: () => {
    return new Loki();
  },
};

@Module({
  imports: [
    ProjectionStorage,
    CQRSModule,
    TypeOrmModule.forFeature([Kid]),
    TypeOrmModule.forFeature([KidEvent]),
  ],
  controllers: [KidsController],
  providers: [
    KidsService,
    ...CommandHandlers,
    ...EventHandlers,
    lokiDB,
    ProjectionStorage,
  ],
})
export class KidsModule implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly command$: CommandBus,
    private readonly event$: EventBus,
    private readonly kidsService: KidsService,
    @Inject('LokiDB') private readonly loki: Loki,
  ) {}

  async onModuleInit() {
    this.command$.setModuleRef(this.moduleRef);
    this.event$.setModuleRef(this.moduleRef);

    this.event$.register(EventHandlers);
    this.command$.register(CommandHandlers);

    await this.initializeLokiDB(); // TODO: move this init to /projections

    await this.kidsService.loadEventsFromDay();
  }

  // create all needed collections for cqrs projections
  async initializeLokiDB() {
    this.loki.addCollection('kidLocations');
  }
}
