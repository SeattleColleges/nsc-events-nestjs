import { Test, TestingModule } from '@nestjs/testing';
import { EventRegistrationService } from './event-registration.service';
import { getModelToken } from '@nestjs/mongoose';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { MongoServerError } from 'mongodb';

describe('EventRegistrationService', () => {
  let service: EventRegistrationService;
  let registrationModel: any;
  let activityModel: any;

  beforeEach(async () => {
    registrationModel = {
      create: jest.fn(),
      deleteOne: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      aggregate: jest.fn(),
    };
    activityModel = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventRegistrationService,
        {
          provide: getModelToken('EventRegistration'),
          useValue: registrationModel,
        },
        { provide: getModelToken('Activity'), useValue: activityModel },
      ],
    }).compile();

    service = module.get<EventRegistrationService>(EventRegistrationService);
  });

  describe('attendEvent', () => {
    it('should create a new registration and return the result', async () => {
      const mockDto = {
        userId: 'user123',
        eventId: 'event456',
        firstName: 'Test',
        lastName: 'User',
        referralSources: [],
      };
      const mockResult = { _id: 'someid', ...mockDto };
      registrationModel.create.mockResolvedValue(mockResult);

      const result = await service.attendEvent(mockDto);

      expect(registrationModel.create).toHaveBeenCalledWith(mockDto);
      expect(result).toEqual(mockResult);
    });

    it('should throw ConflictException if duplicate registration', async () => {
      const mockDto = {
        userId: 'user123',
        eventId: 'event456',
        firstName: 'Test',
        lastName: 'User',
        referralSources: [],
      };
      // Simulate Mongo duplicate key error
      const error = new MongoServerError({} as any);
      (error as any).code = 11000;
      registrationModel.create.mockRejectedValue(error);

      await expect(service.attendEvent(mockDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw InternalServerErrorException for other errors', async () => {
      const mockDto = {
        userId: 'user123',
        eventId: 'event456',
        firstName: 'Test',
        lastName: 'User',
        referralSources: [],
      };
      registrationModel.create.mockRejectedValue(
        new Error('Something went wrong'),
      );

      await expect(service.attendEvent(mockDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('deleteAttendee', () => {
    it('should delete a registration and return result', async () => {
      registrationModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const result = await service.deleteAttendee('user123', 'event456');
      expect(registrationModel.deleteOne).toHaveBeenCalledWith({
        userId: 'user123',
        eventId: 'event456',
      });
      expect(result).toEqual({ deletedCount: 1 });
    });

    it('should throw ConflictException if registration not found', async () => {
      registrationModel.deleteOne.mockResolvedValue({ deletedCount: 0 });

      await expect(
        service.deleteAttendee('user123', 'event456'),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException for other errors', async () => {
      registrationModel.deleteOne.mockRejectedValue(new Error('DB error'));

      await expect(
        service.deleteAttendee('user123', 'event456'),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
  
  describe('isAttendingEvent', () => {
    it('returns true when registration found', async () => {
      registrationModel.findOne.mockResolvedValue({ _id: 'reg1' });

      await expect(service.isAttendingEvent('e1', 'u1')).resolves.toBe(true);
    });

    it('returns false when none found', async () => {
      registrationModel.findOne.mockResolvedValue(null);

      await expect(service.isAttendingEvent('e1', 'u1')).resolves.toBe(false);
    });

    it('wraps errors in InternalServerError', async () => {
      registrationModel.findOne.mockRejectedValue(new Error('db-boom'));

      await expect(
        service.isAttendingEvent('e1', 'u1'),
      ).rejects.toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe('findByEvent', () => {
    it('computes count, anonymousCount, attendeeNames correctly', async () => {
      const docs = [
        { firstName: 'Ana', lastName: 'Alpha' },
        { firstName: null, lastName: null },
      ];
      registrationModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(docs),
      });

      const res = await service.findByEvent('e1');

      expect(res).toEqual({
        count: 2,
        anonymousCount: 1,
        attendeeNames: ['Ana Alpha'],
        attendees: docs,
      });
    });

    it('wraps errors in InternalServerError', async () => {
      registrationModel.find.mockImplementation(() => {
        throw new Error('query-fail');
      });

      await expect(service.findByEvent('e1')).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });

  describe('findByUser', () => {
    it('returns aggregate result', async () => {
      const agg = [{ eventId: 'e1' }];
      registrationModel.aggregate.mockResolvedValue(agg);

      await expect(service.findByUser('u1')).resolves.toBe(agg);
      expect(registrationModel.aggregate).toHaveBeenCalledWith(expect.any(Array));
    });

    it('wraps errors in InternalServerError', async () => {
      registrationModel.aggregate.mockRejectedValue(new Error('agg-err'));

      await expect(service.findByUser('u1')).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });
});
