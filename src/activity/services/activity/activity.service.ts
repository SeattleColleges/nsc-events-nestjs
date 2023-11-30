import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Activity } from '../../schemas/activity.schema';
import { Query } from 'express-serve-static-core';
import { User } from '../../../auth/schemas/userAuth.model';

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
      throw new BadRequestException('Please enter correct id!');
    }
    const activity = await this.activityModel.findById(id).exec();
    if (!activity) {
      throw new NotFoundException('Activity not found!');
    }
    return activity;
  }

  async createEvent(
    activity: Activity,
    creator: User,
  ): Promise<{ activity: Activity; message: string }> {
    // catching any potential errors during db operations and displaying message
    try {
      const data = Object.assign(activity, { createdByUser: creator._id });
      const createdActivity = await this.activityModel.create(data);
      return {
        activity: createdActivity,
        message: 'Activity created successfully.',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateActivityById(
    id: string,
    activity: Activity,
  ): Promise<{ updatedActivity: Activity; message: string }> {
    const isValidId = mongoose.isValidObjectId(id);
    // if provided ID is invalid, throw BadRequestException exception
    if (!isValidId) {
      throw new BadRequestException('Invalid ID. Please enter correct id.');
    }
    const updatedActivity = await this.activityModel
      .findByIdAndUpdate(id, activity, {
        new: true,
        runValidators: true,
      })
      .exec();
    // if no activity found with given ID, throw NotFoundException exception
    if (!updatedActivity) {
      throw new NotFoundException(`Activity with ID ${id} not found.`);
    }
    return {
      updatedActivity,
      message: 'Activity updated successfully.',
    };
  }

  async deleteActivityById(
    id: string,
  ): Promise<{ deletedActivity: Activity; message: string }> {
    const isValidId = mongoose.isValidObjectId(id);
    // if provided ID is invalid, throw BadRequestException exception
    if (!isValidId) {
      throw new BadRequestException('Invalid ID. Please enter correct id.');
    }
    const activity = await this.activityModel.findById(id).exec();
    // if no activity found with given ID, throw NotFoundException exception
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found.`);
    }
    const deletedActivity = await this.activityModel
      .findByIdAndUpdate(id, { isHidden: true })
      .exec();
    return {
      deletedActivity,
      message: 'Activity deleted successfully.',
    };
  }
}
