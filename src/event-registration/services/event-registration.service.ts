import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventRegistration } from '../schemas/event-registration.schema';
import { MongoServerError } from 'mongodb';
import { AttendeeDto } from '../dto/attendEvent.dto';
import { Activity } from '../../activity/schemas/activity.schema';

@Injectable()
export class EventRegistrationService {
  constructor(
    @InjectModel(EventRegistration.name)
    private registrationModel: Model<EventRegistration>,
    @InjectModel(Activity.name)
    private readonly activityModel: Model<Activity>,
  ) {}

  async attendEvent(attendObj: AttendeeDto) {
    const { userId, eventId, firstName, lastName, referralSources } = attendObj;
    try {
      return await this.registrationModel.create({
        userId,
        eventId,
        firstName,
        lastName,
        referralSources,
      });
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        throw new ConflictException(
          'You have already registered for this event.',
        );
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteAttendee(userId: string, eventId: string) {
    try {
      const result = await this.registrationModel.deleteOne({
        userId,
        eventId,
      });

      // Check if the registration was found and deleted
      if (result.deletedCount === 0) {
        throw new ConflictException(
          'No registration found for this user and event.',
        );
      }

      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async isAttendingEvent(eventId: string, userId: string) {
    try {
      // Check if the user is registered for the event
      const registration = await this.registrationModel.findOne({
        eventId,
        userId,
      });
      if (registration) {
        return true;
      }
      return false;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByEvent(eventId: string) {
    try {
      // Find all registrations for the given eventId
      const results = await this.registrationModel.find({ eventId }).exec();

      // Grab the count of attendees
      const count = results.length;

      // Use reduce to create an array of attendee names because some might be anonymous (null)
      const attendeeNames = results.reduce<string[]>((acc, attendee) => {
        if (attendee.firstName && attendee.lastName) {
          acc.push(`${attendee.firstName.trim()} ${attendee.lastName.trim()}`);
        }
        return acc;
      }, []);

      // Calculate the anonymous count (total attendees - attendees with names)
      const anonymousCount = count - attendeeNames.length;

      return { count, anonymousCount, attendeeNames, attendees: results };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByUser(userId: string): Promise<Activity[]> {
    try {
      // aggregate function to join the event registration with the activities collection
      // and return the event details for signed up events by the given userId
      const signedUpEvents = await this.registrationModel.aggregate([
        {
          // Match the userId in the event registration collection
          $match: { userId },
        },
        {
          // Convert the eventId to an ObjectId for the lookup
          // This is necessary because the eventId in the registration collection is a string
          $addFields: {
            eventObjectId: { $toObjectId: '$eventId' },
          },
        },
        {
          $lookup: {
            from: 'activities', // collection to join with
            localField: 'eventObjectId', // use the converted ObjectId field to match with the foreign field in the activities collection
            foreignField: '_id',
            as: 'eventDetails',
          },
        },
        {
          $unwind: '$eventDetails',
        },
        {
          // event data we want to return
          $project: {
            _id: 0, // exclude the _id field from the result
            eventId: '$eventDetails._id',
            eventTitle: '$eventDetails.eventTitle',
            eventDate: '$eventDetails.eventDate',
            eventStartTime: '$eventDetails.eventStartTime',
            eventLocation: '$eventDetails.eventLocation',
            eventHost: '$eventDetails.eventHost',
            // Add or remove fields as needed
          },
        },
      ]);

      return signedUpEvents;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
