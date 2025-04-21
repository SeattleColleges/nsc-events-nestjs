import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventRegistration } from '../schemas/event-registration.schema';
import { MongoServerError } from 'mongodb';
import { AttendeeDto } from '../dto/attendEvent.dto';
import { Activity } from 'src/activity/schemas/activity.schema';


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
        return await this.registrationModel.create({ userId, eventId, firstName, lastName, referralSources });
    } catch (error) {
        if (error instanceof MongoServerError && error.code === 11000) {
            throw new ConflictException('You have already registered for this event.');
        }
            throw new InternalServerErrorException('Something went wrong');
    }
  }

  async deleteAttendee(userId: string, eventId: string) {
    try {
        const result = await this.registrationModel.deleteOne({ userId, eventId });

        // Check if the registration was found and deleted
        if (result.deletedCount === 0) {
            throw new ConflictException('No registration found for this user and event.');
        }

        return result;

    } catch (error) {
        throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findByEvent(eventId: string) {
    try {
        // Find all registrations for the given eventId
        const results = await this.registrationModel.find({ eventId }).exec();

        // Grab the count of attendees
        const count = results.length;

        // Use reduce to create an array of attendee names because some might be anonymous
        const attendeeNames = results.reduce<string[]>((acc, attendee) => {
            if (attendee.firstName && attendee.lastName) {
                acc.push(`${attendee.firstName.trim()} ${attendee.lastName.trim()}`);
            }
            return acc;
        }, []);

        // Calculate the anonymous count (total attendees - attendees with names)
        const anonymousCount = count - attendeeNames.length;

        return { count, anonymousCount, attendeeNames };
    } catch (error) {
        throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findByUser(userId: string): Promise<Activity[]> {
    try {
        // Return list of eventIds for the user
        const results = await this.registrationModel.find({ userId }).select('eventId');
        console.log(results)
        const eventIds = results.map(event => event.eventId);
        
        // Use the eventIds to find the corresponding activities
        // We can change what we want to select from the activity model here with the select statement
        return this.activityModel.find({ _id: { $in: eventIds } }).select('eventTitle eventDate eventStartTime').exec();
    } catch (error) {
        throw new InternalServerErrorException('Something went wrong');
    }
  }
}
