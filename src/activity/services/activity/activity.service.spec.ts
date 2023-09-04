import { Test, TestingModule } from '@nestjs/testing';
import { ActivityService } from './activity.service';
import { getModelToken } from '@nestjs/mongoose';
import { Activity } from '../../schemas/activity.schema';
import { Model } from 'mongoose';

describe('ActivityService', () => {
  let activityService: ActivityService;
  let model: Model<Activity>;
  const mockActivityService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityService,
        {
          provide: getModelToken(Activity.name),
          useValue: mockActivityService,
        },
      ],
    }).compile();

    activityService = module.get<ActivityService>(ActivityService);
    model = module.get<Model<Activity>>(getModelToken(Activity.name));
  });
});
