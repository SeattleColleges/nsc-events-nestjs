import { Test, TestingModule } from '@nestjs/testing';
import { ActivityController } from './activity.controller';
import { ActivityService } from '../../../activity/services/activity/activity.service';
import { Activity } from '../../../activity/schemas/activity.schema';
import { Role, UserDocument } from '../../../user/schemas/user.model';
import mongoose from 'mongoose';
import { PassportModule } from '@nestjs/passport';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ActivityController', () => {
  let controller: ActivityController;
  let service: ActivityService;

  const mockActivityService = {
    getAllActivities: jest.fn(),
    getActivityById: jest.fn(),
    createEvent: jest.fn(),
    attendEvent: jest.fn(),
    updateActivityById: jest.fn(),
    deleteActivityById: jest.fn(),
  };

  const mockUser = {
    // mock user ID
    _id: new mongoose.Types.ObjectId().toString(),
    name: 'test',
    email: 'test@gmail.com',
    password: '1234567890',
    role: Role.admin,
  } as unknown as UserDocument;

  const mockActivity = {
    // mock activity ID
    _id: new mongoose.Types.ObjectId().toString(),
    // mock User ID
    createdByUser: mockUser._id,
    eventTitle: 'Sample Event',
    eventDescription: 'description',
    eventCategory: 'Tech',
    eventDate: new Date('2023-08-15'),
    eventStartTime: '10:00 AM',
    eventEndTime: '1:00 PM',
    eventLocation: '123 Main Street, City',
    eventCoverPhoto: 'https://ourCloudStorage.com/sample-event.photo.png',
    eventHost: 'Sample Organization',
    eventWebsite: 'https://example.com/sample-event',
    eventRegistration: 'Register at https://example.com/registration',
    eventCapacity: '100',
    eventCost: '$10',
    eventTags: ['Tech', 'Conference', 'Networking'],
    eventSchedule: '10AM - Registration\n11AM - Keynote\n12PM - Lunch\n2PM - Workshops\n4PM - Closing Remarks',
    eventSpeakers: ['John Doe', 'Jane Smith'],
    eventPrerequisites: 'None',
    eventCancellationPolicy: 'Full refund if canceled at least 7 days before the event.',
    eventContact: 'club@email.com',
    eventSocialMedia: {
      facebook: 'https://www.facebook.com/sampleevent',
      twitter: 'https://twitter.com/sampleevent',
      instagram: 'https://www.instagram.com/sampleevent',
      hashtag:'#SampleEvent2023'
    },
    eventPrivacy: null,
    eventAccessibility: 'Wheelchair accessible venue.',
    isHidden: false,
  };

  const mockUpdateActivity = {
    // mock activity ID
    _id: new mongoose.Types.ObjectId().toString(),
    // Mock User ID
    createdByUser: mockUser._id,
    eventTitle: 'Sample Event Updated',
    eventDescription: 'description updated',
    eventCategory: 'Tech',
    eventDate: new Date('2023-08-15'),
    eventStartTime: '10:00 AM',
    eventEndTime: '1:00 PM',
    eventLocation: '123 Main Street, City',
    eventCoverPhoto: 'https://ourCloudStorage.com/sample-event.photo.png',
    eventHost: 'Sample Organization',
    eventWebsite: 'https://example.com/sample-event',
    eventRegistration: 'Register at https://example.com/registration',
    eventCapacity: '100',
    eventCost: '$10',
    eventTags: ['Tech', 'Conference', 'Networking'],
    eventSchedule: '10AM - Registration\n11AM - Keynote\n12PM - Lunch\n2PM - Workshops\n4PM - Closing Remarks',
    eventSpeakers: ['John Doe', 'Jane Smith'],
    eventPrerequisites: 'None',
    eventCancellationPolicy: 'Full refund if canceled at least 7 days before the event.',
    eventContact: 'club@email.com',
    eventSocialMedia: {
      facebook: 'https://www.facebook.com/sampleevent',
      twitter: 'https://twitter.com/sampleevent',
      instagram: 'https://www.instagram.com/sampleevent',
      hashtag:'#SampleEvent2023'
    },
    eventPrivacy: null,
    eventAccessibility: 'Wheelchair accessible venue updated.',
    isHidden: false,
  };

  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [ActivityController],
      providers: [
        {
          provide: ActivityService,
          useValue: mockActivityService,
        },
      ],
    }).compile();
    controller = module.get<ActivityController>(ActivityController);
    service = module.get<ActivityService>(ActivityService);
    jest.clearAllMocks();
  });


  describe('getAllActivities', () => {
    // testing succesfull fetches of activities
    it('should return an array of activiites', async () => {
      // setting up conditions for test
      const mockSingleActivity: Activity[] = [mockActivity];
      jest
        .spyOn(service, 'getAllActivities').mockResolvedValue(mockSingleActivity);
      const result = await controller.getAllActivities({});
      // verifying getAllActivities behaves as expected, (checking return value)
      expect(result).toEqual(mockSingleActivity);
    });

    // testing succesfull fetches of no activities
    it('should return an empty array if no activities are found', async () => {
      const mockEmptyActivities: Activity[] = [];
      jest
        .spyOn(service, 'getAllActivities').mockResolvedValue(mockEmptyActivities);
      const result = await controller.getAllActivities({});
      expect(result).toEqual(mockEmptyActivities);
      expect(result).toHaveLength(0);
      expect(service.getAllActivities).toHaveBeenCalledWith({});
    });

    // testing for failure scenario
    it('should handle exceptions from the service', async () => {
      const errorMessage = 'Error fetching activities';
      jest
        .spyOn(service, 'getAllActivities').mockRejectedValue(new Error(errorMessage));
      await expect(controller.getAllActivities({})).rejects.toThrowError(errorMessage);
    });
  });

  
  describe('getActivityById', () => {
    it('should return a single activity', async () => {
      const id = mockActivity._id;
      jest.spyOn(service, 'getActivityById').mockResolvedValue(mockActivity);
      const result = await controller.findActivityById(id);
      expect(result).toEqual(mockActivity);
      expect(service.getActivityById).toHaveBeenCalledWith(id);
    });

    it('should return null if no activity is found', async () => {
      // generating a new mock id
      const id = new mongoose.Types.ObjectId().toString();
      jest.spyOn(service, 'getActivityById').mockResolvedValue(null);
      const result = await controller.findActivityById(id);
      expect(result).toBeNull();
      expect(service.getActivityById).toHaveBeenCalledWith(id);
    });
  });

  
  describe('createEvent', () => {
    it('should successfully create and return an event', async () => {
      const mockCreateEvent = {
        createdByUser: mockUser._id,
        eventTitle: 'Sample Event',
        eventDescription: 'description',
        eventCategory: 'Tech',
        eventDate: new Date('2023-08-15'),
        eventStartTime: '10:00 AM',
        eventEndTime: '1:00 PM',
        eventLocation: '123 Main Street, City',
        eventCoverPhoto: 'https://ourCloudStorage.com/sample-event.photo.png',
        eventHost: 'Sample Organization',
        eventWebsite: 'https://example.com/sample-event',
        eventRegistration: 'Register at https://example.com/registration',
        eventCapacity: '100',
        eventCost: '$10',
        eventTags: ['Tech', 'Conference', 'Networking'],
        eventSchedule: '10AM - Registration\n11AM - Keynote\n12PM - Lunch\n2PM - Workshops\n4PM - Closing Remarks',
        eventSpeakers: ['John Doe', 'Jane Smith'],
        eventPrerequisites: 'None',
        eventCancellationPolicy: 'Full refund if canceled at least 7 days before the event.',
        eventContact: 'club@email.com',
        eventSocialMedia: {
          facebook: 'https://www.facebook.com/sampleevent',
          twitter: 'https://twitter.com/sampleevent',
          instagram: 'https://www.instagram.com/sampleevent',
          hashtag:'#SampleEvent2023'
        },
        eventPrivacy: null,
        eventAccessibility: 'Wheelchair accessible venue.',
        isHidden: false,
      };
      const expectedResponse = {
        activity: mockCreateEvent,
        message: 'Activity created successfully.',
      };
      jest.spyOn(service, 'createEvent').mockResolvedValue(expectedResponse);
      const result = await controller.addEvent(mockCreateEvent, {
        user: mockUser,
      });
      expect(result).toEqual(expectedResponse);
      expect(service.createEvent).toHaveBeenCalledWith(
        mockCreateEvent,
        mockUser,
      );
    });

    it('should handle exceptions from the service', async () => {
      const mockCreateEvent = {
        createdByUser: mockUser._id,
        eventTitle: 'Sample Event',
        eventDescription: 'description',
        eventCategory: 'Tech',
        eventDate: new Date('2023-08-15'),
        eventStartTime: '10:00 AM',
        eventEndTime: '1:00 PM',
        eventLocation: '123 Main Street, City',
        eventCoverPhoto: 'https://ourCloudStorage.com/sample-event.photo.png',
        eventHost: 'Sample Organization',
        eventWebsite: 'https://example.com/sample-event',
        eventRegistration: 'Register at https://example.com/registration',
        eventCapacity: '100',
        eventCost: '$10',
        eventTags: ['Tech', 'Conference', 'Networking'],
        eventSchedule: '10AM - Registration\n11AM - Keynote\n12PM - Lunch\n2PM - Workshops\n4PM - Closing Remarks',
        eventSpeakers: ['John Doe', 'Jane Smith'],
        eventPrerequisites: 'None',
        eventCancellationPolicy: 'Full refund if canceled at least 7 days before the event.',
        eventContact: 'club@email.com',
        eventSocialMedia: {
          facebook: 'https://www.facebook.com/sampleevent',
          twitter: 'https://twitter.com/sampleevent',
          instagram: 'https://www.instagram.com/sampleevent',
          hashtag:'#SampleEvent2023'
        },
        eventPrivacy: null,
        eventAccessibility: 'Wheelchair accessible venue.',
        isHidden: false,
      };
      const errorMessage = 'Error occurred while creating event';
      jest
        .spyOn(service, 'createEvent').mockRejectedValue(new Error(errorMessage));
      await expect(
        controller.addEvent(mockCreateEvent, { user: mockUser })).rejects.toThrowError(errorMessage);
    });
    // todo: add a test case for a invalid or missing field entry
  });


  describe('attendEvent', () => {
    it('should successfully update attend event attendance', async () => {
      const eventId = new mongoose.Types.ObjectId().toString();
      const mockAttendEvent = {
        attendanceCount: 0,
        attendee: {
          firstName: 'John',
          lastName: 'Doe',
        },
      };
      const updatedActivity = {
        ...mockActivity,
        // Assuming attendance was incremented
        attendanceCount: 1,
        attendees: [mockAttendEvent.attendee],
      };
      jest
        .spyOn(service, 'attendEvent').mockResolvedValue(updatedActivity);
      const result = await controller.attendEvent(eventId, mockAttendEvent);
      expect(result).toEqual(updatedActivity);
      expect(service.attendEvent).toHaveBeenCalledWith(
        eventId,
        mockAttendEvent,
      );
    });

    it('should throw BadRequestException for invalid event ID', async () => {
      const invalidEventId = 'invalid-id';
      const mockAttendEvent = {};
      jest.spyOn(service, 'attendEvent').mockImplementation(() => {
        throw new BadRequestException('Invalid event ID.');
      });
      await expect(
        controller.attendEvent(invalidEventId, mockAttendEvent))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException for non-existing event', async () => {
      const nonExistingEventId = new mongoose.Types.ObjectId().toString();
      const mockAttendEvent = {};
      jest.spyOn(service, 'attendEvent').mockImplementation(() => {
        throw new NotFoundException('Activity not found!');
      });
      await expect(
        controller.attendEvent(nonExistingEventId, mockAttendEvent))
        .rejects.toThrow(NotFoundException);
    });
  });


  describe('updateActivityById', () => {
    it('should successfully update an activity', async () => {
      const id = mockActivity._id;
      const updatedActivityResponse = {
        updatedActivity: mockUpdateActivity,
        message: 'Activity updated successfully.',
      };
      jest
        .spyOn(service, 'updateActivityById').mockResolvedValue(updatedActivityResponse);
      const result = await controller.updateActivityById(
        id,
        mockUpdateActivity,
        { user: mockUser, }
      );
      expect(result).toEqual(updatedActivityResponse);
      expect(service.updateActivityById).toHaveBeenCalledWith(
        id,
        mockUpdateActivity,
      );
    });

    it('should throw BadRequestException for invalid ID', async () => {
      const invalidId = 'invalid-id';
      jest.spyOn(service, 'updateActivityById').mockImplementation(() => {
        throw new BadRequestException('Invalid ID. Please enter correct id.');
      });
      await expect(
        controller.updateActivityById(invalidId, mockUpdateActivity, { user: mockUser }))
        .rejects.toThrow(BadRequestException);
    });
  
    it('should throw NotFoundException for non-existing activity', async () => {
      const nonExistingId = new mongoose.Types.ObjectId().toString();
      jest.spyOn(service, 'updateActivityById').mockImplementation(() => {
        throw new NotFoundException(
          `Activity with ID ${nonExistingId} not found.`,
        );
      });
      await expect(
        controller.updateActivityById(nonExistingId, mockUpdateActivity, { user: mockUser }))
        .rejects.toThrow(NotFoundException);
    });
  });

  
  describe('deleteActivityById', () => {
    it('should successfully delete an activity', async () => {
      const id = mockActivity._id;
      const deleteResponse = {
        deletedActivity: mockActivity,
        message: 'Activity deleted successfully.',
      };
      jest
        .spyOn(service, 'deleteActivityById').mockResolvedValue(deleteResponse);
      const result = await controller.deleteActivityById(id, {
        user: mockUser,
      });
      expect(result).toEqual(deleteResponse);
      expect(service.deleteActivityById).toHaveBeenCalledWith(id);
    });

    it('should throw BadRequestException for invalid ID', async () => {
      const invalidId = 'invalid-id';
      jest.spyOn(service, 'deleteActivityById').mockImplementation(() => {
        throw new BadRequestException('Invalid ID. Please enter correct id.');
      });
      await expect(
        controller.deleteActivityById(invalidId, { user: mockUser }))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException for non-existing activity', async () => {
      const nonExistingId = new mongoose.Types.ObjectId().toString();
      jest.spyOn(service, 'deleteActivityById').mockImplementation(() => {
        throw new NotFoundException(
          `Activity with ID ${nonExistingId} not found.`,
        );
      });
      await expect(
        controller.deleteActivityById(nonExistingId, { user: mockUser }))
        .rejects.toThrow(NotFoundException);
    });
  });

});
