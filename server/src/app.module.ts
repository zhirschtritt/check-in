import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KidsModule } from './kids/kids.module';
import { KidsService } from '../src/kids/kids.service';
import { KidsController } from './kids/kids.controller';
import { LocationsController } from './locations/locations.controller';
import { LocationsService } from './locations/locations.service';
import { LocationsModule } from './locations/locations.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(),
    KidsModule,
    LocationsModule,
  ],
  controllers: [AppController, LocationsController, KidsController],
  providers: [AppService, LocationsService, KidsService],
})
export class ApplicationModule {
  constructor(private readonly connection: Connection) {}
}
