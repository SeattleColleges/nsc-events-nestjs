import { Test, TestingModule } from '@nestjs/testing';
import { ActivityService } from './activity.service';
import { getModelToken } from '@nestjs/mongoose';
import mockActivity from '../../../../test/mock-data/activity';

describe('ActivityService', () => {
  let service: ActivityService;
  let mockModel: jest.Mock<any, any, any>;

  beforeEach(async () => {
    // save is called in the addEvent method so we must mock its behavior.
    mockModel = jest.fn().mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({ ...mockActivity, _id: 'DUMMY_ID' }),
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityService,
        {
          provide: getModelToken('Activity'),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<ActivityService>(ActivityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addEvent should return id', async () => {
    const result = await service.addEvent(mockActivity);
    expect(result).toBeDefined();
    expect(result).toBe('DUMMY_ID');
  });
});
