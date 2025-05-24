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
});
