import { CommandBus, EventBus, CQRSModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { KidsController } from './kids.controller';
import { KidsService } from './kids.service';
import { KidRepository } from './repository/kid.repository';
import { OnModuleInit, Module } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kid } from './kid.entity';

@Module({
  imports: [CQRSModule, TypeOrmModule.forFeature([Kid])],
  controllers: [KidsController],
  providers: [
    KidsService,
    ...CommandHandlers,
    ...EventHandlers,
    KidRepository,
  ],
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