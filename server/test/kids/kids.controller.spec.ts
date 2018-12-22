import 'jest';
import { Test, TestingModule } from '@nestjs/testing';
import { KidsController } from '../../src/kids/kids.controller';

describe('Kids Controller', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [KidsController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: KidsController = module.get<KidsController>(KidsController);
    expect(controller).toBeDefined();
  });
});
