import { Test, TestingModule } from '@nestjs/testing';
import { ActivityController } from './activity.controller';

describe('ActivityController', () => {
  let controller: ActivityController;
  // TODO: add necessary mocked methods
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityController],
    }).compile();

    controller = module.get<ActivityController>(ActivityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
