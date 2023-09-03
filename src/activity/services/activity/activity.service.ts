import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Activity } from '../../schemas/activity.schema';
import { Query } from 'express-serve-static-core';

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

    // search by event tags
    const keyword = query.keyword
      ? {
          eventTags: {
            // using regex to look if any entries contain the text
            $regex: query.keyword,
            $options: 'i', // case insensitive
          },
        }
      : {};
    return await this.activityModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip)
      .exec();
  }

  async getActivityById(id: string): Promise<Activity> {
    console.log('service id: ', id);
    let activity: Activity;
    try {
      activity = await this.activityModel.findById(id).exec();
    } catch (error) {
      throw new HttpException('Activity not found!', 404);
    }
    if (!activity) {
      throw new HttpException('Activity not found!', 404);
    }
    return activity;
  }

  async createEvent(
    createActivity: Activity,
  ): Promise<Activity & { _id: Types.ObjectId }> {
    const newEvent = new this.activityModel(createActivity);
    return await newEvent.save();
  }

  async updateActivityById(
    id: string,
    activity: Activity,
  ): Promise<Activity & { _id: Types.ObjectId }> {
    const updatedActivity = await this.activityModel
      .findByIdAndUpdate(id, activity, {
        new: true,
        runValidators: true,
      })
      .exec();
    return await updatedActivity.save();
  }

  async deleteActivityById(
    id: string,
  ): Promise<Activity & { _id: Types.ObjectId }> {
    return await this.activityModel.findByIdAndDelete(id).exec();
  }
}
