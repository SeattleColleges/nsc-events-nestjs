import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Activity } from '../../schemas/activity.schema';
import { Query } from 'express-serve-static-core';
import { User } from '../../../auth/schemas/userAuthSchema';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity.name)
    private activityModel: Model<Activity>,
  ) {
    // activity defined in activity.module.ts
  }
  async getAllActivities(query: Query): Promise<Activity[]> {
    // pagination options
    const resPerPage = 5;
    const currentPage: number = Number(query.page) || 1;

    // skips the number of results according to page number and number of results per page
    const skip = resPerPage * (currentPage - 1);
    // TODO: add ability to query by host/club
    // search by event tags
    const tag = query.tag
      ? {
          eventTags: {
            // using regex to look if any entries contain the text
            $regex: query.tag,
            $options: 'i', // case insensitive
          },
        }
      : {};
    return await this.activityModel
      .find({ ...tag })
      .limit(resPerPage)
      .skip(skip)
      .exec();
  }

  async getActivityById(id: string): Promise<Activity> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }
    const activity = await this.activityModel.findById(id).exec();
    if (!activity) {
      throw new NotFoundException('Activity not found!');
    }
    return activity;
  }

  async createEvent(activity: Activity, creator: User): Promise<Activity> {
    const data = Object.assign(activity, { createdByUser: creator._id });
    return await this.activityModel.create(data);
  }

  async updateActivityById(id: string, activity: Activity): Promise<Activity> {
    // TODO: return a bad request exception when item doesn't exist
    return await this.activityModel
      .findByIdAndUpdate(id, activity, {
        new: true,
        runValidators: true,
      })
      .exec();
  }

  async deleteActivityById(id: string): Promise<Activity> {
    return await this.activityModel.findByIdAndDelete(id).exec();
  }
}
