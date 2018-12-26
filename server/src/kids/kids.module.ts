import {CommandBus, EventBus, CQRSModule} from '@nestjs/cqrs';
import {CommandHandlers} from './commands/handlers';
import {EventHandlers} from './events/handlers';
import {KidsController} from './kids.controller';
import {KidsService} from './kids.service';
import {OnModuleInit, Module} from '@nestjs/common';
import {ModuleRef} from '@nestjs/core';
import {TypeOrmModule} from '@nestjs/typeorm';
import {KidEntity} from './kid.entity';
import {EventEntity} from './events/event.entity';

@Module({
  imports: [
    CQRSModule,
    TypeOrmModule.forFeature([KidEntity]),
    TypeOrmModule.forFeature([EventEntity]),
  ],
  controllers: [KidsController],
  providers: [KidsService, ...CommandHandlers, ...EventHandlers],
})
export class KidsModule implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly command$: CommandBus,
    private readonly event$: EventBus,
  ) {}

  onModuleInit() {
    this.command$.setModuleRef(this.moduleRef);
    this.event$.setModuleRef(this.moduleRef);

    this.event$.register(EventHandlers);
    this.command$.register(CommandHandlers);
  }
}
