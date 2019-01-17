import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Connection} from 'typeorm';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {KidsModule} from './kids/kids.module';
import {KidsService} from './kids/kids.service';
import {KidsController} from './kids/kids.controller';
import {LocationsController} from './locations/locations.controller';
import {LocationsService} from './locations/locations.service';
import {LocationsModule} from './locations/locations.module';
import {KidsCqrsService} from './kids/kids-cqrs.service';
import {DexieInMemoryDb} from './kids/projections/in-memory-db';
import {LoggerModule, LogFactory} from './common/logger';
@Module({
  imports: [TypeOrmModule.forRoot(), KidsModule, LocationsModule, LoggerModule],
  controllers: [AppController, LocationsController, KidsController],
  providers: [
    AppService,
    LocationsService,
    KidsService,
    KidsCqrsService,
    {provide: 'InMemoryDb', useClass: DexieInMemoryDb},
    {provide: 'LogFactory', useValue: LogFactory},
  ],
})
export class ApplicationModule {
  constructor(private readonly connection: Connection) {}
}
