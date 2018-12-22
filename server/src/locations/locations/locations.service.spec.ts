import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from './locations.service';

describe('LocationsService', () => {
  let service: LocationsService;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocationsService],
    }).compile();
    service = module.get<LocationsService>(LocationsService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
