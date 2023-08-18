import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityDocument } from 'src/activity/types/activity.model';

@Injectable()
export class ActivityService {
    constructor(@InjectModel('Activity') private activityModel: Model<ActivityDocument>) {
    // activity defined in activity.module.ts

    }
    async getAllActivities(): Promise<any> {
        const activities: ActivityDocument[] = await this.activityModel.find().exec();
        return activities.map((activity) => ({
            eventTitle: activity.eventTitle,
            eventCategory: activity.eventCategory,
            eventTags: activity.eventTags,
        }));
    } 
}
