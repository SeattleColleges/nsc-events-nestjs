import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityDocument } from 'src/activity/types/activity.model';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel('Activity') private activityModel: Model<ActivityDocument>,
  ) {
    // activity defined in activity.module.ts
  }
  async getAllActivities(): Promise<ActivityDocument[]> {
    return await this.activityModel.find().exec();
    // only reason to map is to transform the data. In the case of user.
    // I was mapping to transform the data to hide sensitive information
    // But we should use serialization which comes in a later video, and we will
    // on a future iteration. May need it here for eventCreatorId.
  }

  async addEvent(eventTitle: string, eventCategory: string, eventTags: string[]): Promise<any> {
    const newEvent = new this.activityModel({ eventTitle, eventCategory, eventTags});
    const result = await newEvent.save();
    return result._id;
  }
}
