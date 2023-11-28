/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ActivityService } from './activity.service';
import mongoose, { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Activity } from '../../schemas/activity.schema';
import { CreateActivityDto } from '../../dto/create-activity.dto';
import { User } from '../../../auth/schemas/userAuth.model';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import createMockActivity from '../../../../test/mock-data/createMockActivity';
import mockActivityFromDB from '../../../../test/mock-data/returned-mock-activity';

describe('ActivityService', () => {
  let activityService: ActivityService;
  let model: Model<Activity>;
  const mockActivityService = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const mockUser = {
    _id: '64f6b79583e4cdccda1a02b2',
    name: 'BC Ko',
    email: 'bc@gmail.com',
  };

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
  describe('getAllActivities', () => {
    it('should return an array of events', async () => {
      const query = { page: '1', tag: 'tech' };
      jest.spyOn(model, 'find').mockImplementation(
        () =>
          ({
            limit: () => ({
              skip: () => ({
                // find always returns this value in the scope of this it block
                exec: jest.fn().mockResolvedValue([mockActivityFromDB]),
              }),
            }),
          }) as any,
      );
      const result = await activityService.getAllActivities(query);
      expect(model.find).toHaveBeenCalledWith({
        eventTags: {
          // using regex to look if any entries contain the text
          $regex: 'tech',
          $options: 'i', // case insensitive
        },
      });
      expect(result).toEqual([mockActivityFromDB]);
    });
  });
  describe('getActivityById', () => {
    beforeEach(() => {
      jest.spyOn(model, 'findById').mockImplementation(
        () =>
          ({
            exec: jest.fn().mockResolvedValue(mockActivityFromDB),
          }) as any,
      );
    });
    it('should find and return an event by ID', async () => {
      const result = await activityService.getActivityById(
        mockActivityFromDB._id,
      );
      expect(model.findById).toHaveBeenCalledWith(mockActivityFromDB._id);
      expect(result).toEqual(mockActivityFromDB);
    });

    it('should throw BadRequestException if invalid ID is provided', async () => {
      const id = 'invalid-id';
      const isValidObjectIdMock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValue(false);

      await expect(activityService.getActivityById(id)).rejects.toThrow(
        BadRequestException,
      );
      expect(isValidObjectIdMock).toHaveBeenCalledWith(id);
      // important removes the mock implementation and restores back to actual
      isValidObjectIdMock.mockRestore();
    });

    it('should throw NotFoundException if event is not found ', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any); // use any cautiously. we are not concerned with shape of data here
      await expect(
        activityService.getActivityById(mockActivityFromDB._id),
      ).rejects.toThrow(NotFoundException);
      expect(model.findById).toHaveBeenCalledWith(mockActivityFromDB._id);
    });
  });

  // TODO: refactor with user after doing auth Jest #1 vid timestamp 29:50
  describe('createEvent', () => {
    it('should create and return an event', async () => {
      const newEvent = createMockActivity;
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve(newEvent) as any);

      const result = (await activityService.createEvent(
        createMockActivity as CreateActivityDto,
        mockUser as User,
      )) as unknown as Activity;

      expect(result).toEqual(newEvent);
    });
  });

  describe('updateActivityById', () => {
    it('should update and return an event', async () => {
      const updatedEvent = {
        ...createMockActivity,
        eventTitle: 'Original Title',
      };
      const activity = { eventTitle: 'Updated Title' };
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(updatedEvent),
      } as any);
      const result = await activityService.updateActivityById(
        mockActivityFromDB._id,
        activity as any,
      );
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        mockActivityFromDB._id,
        activity,
        {
          new: true,
          runValidators: true,
        },
      );
      expect(result.eventTitle).toEqual(updatedEvent.eventTitle);
    });
  });

  describe('deleteActivityById', () => {
    it('should delete and return the event', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockActivityFromDB),
      } as any);
      const result = await activityService.deleteActivityById(
        mockActivityFromDB._id,
      );
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        mockActivityFromDB._id,
        { isHidden: true },
        { new: true, runValidators: true }
      );
      expect(result).toEqual(mockActivityFromDB);
    });
  });
});

// TODO: unit tests for auth timestamp 36:21
// https://www.youtube.com/watch?v=aBjmdLmE2zI&list=PLdAEGQHOerPAMLdJim5Peryj6_2Q-477Z&index=7
