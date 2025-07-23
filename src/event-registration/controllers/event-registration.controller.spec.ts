import { Test, TestingModule } from '@nestjs/testing';
import { EventRegistrationController } from './event-registration.controller';
import { EventRegistrationService } from '../services/event-registration.service';
import { AttendeeDto } from '../dto/attendEvent.dto';

describe('EventRegistrationController', () => {
  let controller: EventRegistrationController;
  let service: EventRegistrationService;

  const mockEventRegistrationService = {
    attendEvent: jest.fn(),
    deleteAttendee: jest.fn(),
    isAttendingEvent: jest.fn(),
    findByEvent: jest.fn(),
    findByUser: jest.fn(),
  };

  beforeEach(async () => {
    // Set up a testing module with the controller and a mocked version of the service.
    // This ensures all service calls in the controller are isolated and can be tracked/asserted.
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventRegistrationController],
      providers: [
        {
          provide: EventRegistrationService,
          useValue: mockEventRegistrationService,
        },
      ],
    }).compile();

    controller = module.get<EventRegistrationController>(
      EventRegistrationController,
    );
    service = module.get<EventRegistrationService>(EventRegistrationService);

    jest.clearAllMocks();
  });

  describe('registerAttendee', () => {
    it('should register an attendee and return the result', async () => {
      const mockAttendee: AttendeeDto = {
        userId: 'user123',
        eventId: 'event456',
        referralSources: [],
      };
      const mockResult = { success: true };

      jest.spyOn(service, 'attendEvent').mockResolvedValue(mockResult as any);

      const result = await controller.registerAttendee(mockAttendee);

      expect(service.attendEvent).toHaveBeenCalledWith(mockAttendee);
      expect(result).toBe(mockResult);
    });
  });

  describe('unregisterAttendee', () => {
    it('should pass userId & eventId to service.deleteAttendee and return the result', async () => {
      const body = { userId: 'user123', eventId: 'event456' };
      const mockResult = { deletedCount: 1 };

      jest
        .spyOn(service, 'deleteAttendee')
        .mockResolvedValue(mockResult as any);

      const result = await controller.unregisterAttendee(body);

      expect(service.deleteAttendee).toHaveBeenCalledWith(
        'user123',
        'event456',
      );
      expect(result).toBe(mockResult);
    });
  });

  describe('isAttendingEvent', () => {
    it('should return true if user is attending the event', async () => {
      const eventId = 'event123';
      const userId = 'user456';
      const mockResponse = { isAttending: true };

      jest
        .spyOn(service, 'isAttendingEvent')
        .mockResolvedValue(mockResponse as any);

      const result = await controller.isAttendingEvent(eventId, userId);

      expect(service.isAttendingEvent).toHaveBeenCalledWith(eventId, userId);
      expect(result).toBe(mockResponse);
    });

    it('should return false if user is not attending the event', async () => {
      const eventId = 'event123';
      const userId = 'user789';
      const mockResponse = { isAttending: false };

      jest
        .spyOn(service, 'isAttendingEvent')
        .mockResolvedValue(mockResponse as any);

      const result = await controller.isAttendingEvent(eventId, userId);

      expect(service.isAttendingEvent).toHaveBeenCalledWith(eventId, userId);
      expect(result).toBe(mockResponse);
    });
  });

  describe('additional controller methods', () => {
    it('should relay payload from service for getAttendeesForEvent', async () => {
      const payload = {
        count: 2,
        anonymousCount: 0,
        attendeeNames: ['Ana Alpha'],
        attendees: [],
      };

      jest.spyOn(service, 'findByEvent').mockResolvedValue(payload as any);

      const result = await controller.getAttendeesForEvent('eventId123');

      expect(service.findByEvent).toHaveBeenCalledWith('eventId123');
      expect(result).toBe(payload);
    });

    it('should relay events array from service for getEventsForUser', async () => {
      const events = [{ eventId: 'e1' }, { eventId: 'e2' }];

      jest.spyOn(service, 'findByUser').mockResolvedValue(events as any);

      const result = await controller.getEventsForUser('userId123');

      expect(service.findByUser).toHaveBeenCalledWith('userId123');
      expect(result).toBe(events);
    });
  });
});
