import { Test, TestingModule } from '@nestjs/testing';
import { LocationsController } from './locations.controller';

describe('Locations Controller', () => {
  let module: TestingModule;
  
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [LocationsController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: LocationsController = module.get<LocationsController>(LocationsController);
    expect(controller).toBeDefined();
  });
});
