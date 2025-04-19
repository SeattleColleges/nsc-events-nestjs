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
import { AttendEventDto } from '../../dto/attend-event.dto';
import { format } from 'date-fns';
import { S3Service } from './s3.service';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity.name)
    private activityModel: Model<Activity>,
    private readonly s3Service: S3Service,
  ) {
    // activity defined in activity.module.ts
  }

  async getAllActivities(query: Query): Promise<Activity[]> {
    // pagination options
    const resPerPage = Number(query.numEvents) || 5;
    const currentPage: number = Number(query.page) || 1;

    // skips the number of results according to page number and number of results per page
    const skip = resPerPage * (currentPage - 1);
    const tagsArray =
      query.tags && typeof query.tags === 'string' ? query.tags.split(',') : [];
    const tags =
      tagsArray.length > 0
        ? {
            $and: tagsArray.map((tag) => ({
              eventTags: {
                $regex: tag,
                $options: 'i', // case insensitive
              },
            })),
          }
        : {};
    const filter: any = {
      ...tags,
      isArchived: query.isArchived || false,
      isHidden: query.isHidden || false,
    };
    // Auto archive the old events
    const now = new Date();
    await this.activityModel.updateMany(
      {
        $or: [
          { eventDate: { $lt: format(now, 'yyyy-MM-dd') } },
          {
            $and: [
              { eventDate: { $eq: format(now, 'yyyy-MM-dd') } },
              { eventEndTime: { $lte: format(now, 'hh:mma') } },
            ],
          },
        ],
      },
      { $set: { isArchived: true } },
    );

    return await this.activityModel
      .find({ ...filter })
      .sort({ eventDate: 1, _id: 1 })
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

  async getActivitiesByUserId(
    query: Query,
    userId: string,
  ): Promise<Activity[]> {
    const isValidId = mongoose.isValidObjectId(userId);
    if (!isValidId) {
      throw new BadRequestException('Please enter correct user id.');
    }
    try {
      // pagination options
      const resPerPage = Number(query.numEvents) || 5;
      const currentPage: number = Number(query.page) || 1;
      // skips the number of results according to page number and number of results per page
      const skip = resPerPage * (currentPage - 1);
      const activities = this.activityModel
        .find({ createdByUser: userId, isArchived: false, isHidden: false })
        .sort({ eventDate: 1, _id: 1 })
        .limit(resPerPage)
        .skip(skip)
        .exec();
      return activities;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
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
  /*
    @param: eventID
    @return: activity
  */
  async attendEvent(
    eventId: string,
    attendEventDto?: AttendEventDto,
  ): Promise<Activity> {
    // Check if the event ID is valid
    const isValidId = mongoose.isValidObjectId(eventId);
    if (!isValidId) {
      throw new BadRequestException('Invalid event ID.');
    }

    // Retrieve the activity by ID and check if it exists
    const activity = await this.activityModel.findById(eventId).exec();
    if (!activity) {
      throw new NotFoundException('Activity not found!');
    }

    // Increment the attendance count
    activity.attendanceCount = (activity.attendanceCount || 0) + 1;

    // If attendee details are provided, add them to the attendees array
    if (attendEventDto?.attendee) {
      const attendeeName = {
        firstName: attendEventDto.attendee.firstName,
        lastName: attendEventDto.attendee.lastName,
      };
      activity.attendees = activity.attendees || [];
      activity.attendees.push(attendeeName);
    }

    await activity.save();
    return activity;
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

  async archiveActivityById(
    id: string,
  ): Promise<{ archivedActivity: Activity; message: string }> {
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
    // Fetch the current value of isArchived
    const currentIsArchived = activity.isArchived;
    // Toggle the value of isArchived
    const newIsArchived = !currentIsArchived;

    // Update the document with the new value of isArchived
    const archivedActivity = await this.activityModel
      .findByIdAndUpdate(
        id,
        { $set: { isArchived: newIsArchived } }, // Set the new value of isArchived
        { new: true },
      )
      .exec();
    return {
      archivedActivity,
      message: 'Activity archived successfully.',
    };
  }

  /**
   * Add a cover image to an activity.
   * Uploads the image to S3 and updates the activity with the image URL.
   *
   * @param activityId - The ID of the activity.
   * @param image - The image file to upload.
   * @returns The updated activity with the cover image URL.
   * @throws {BadRequestException} If the activity ID is invalid or the image upload fails.
   * @throws {NotFoundException} If the activity is not found.
   */

  async addCoverImage(
    activityId: string,
    image: Express.Multer.File,
  ): Promise<Activity> {
    const isValidId = mongoose.isValidObjectId(activityId);
    if (!isValidId) {
      throw new BadRequestException('Invalid activity ID.');
    }

    const activity = await this.activityModel.findById(activityId).exec();
    if (!activity) {
      throw new NotFoundException('Activity not found!');
    }

    // If an image already exists, delete it from S3, this is done to prevent orphaned images
    // and to ensure that the new image is the only one associated with the activity.
    if (activity.eventCoverPhoto) {
      const existingImageKey = activity.eventCoverPhoto.split('/').pop();
      await this.s3Service.deleteFile(existingImageKey).catch((error) => {
        throw new BadRequestException(
          `Failed to delete existing image: ${error.message}`,
        );
      });
    }
    // Upload the image to S3 and get the URL
    const imageUrl = await this.s3Service
      .uploadFile(image, 'cover-images')
      .catch((error) => {
        throw new BadRequestException(
          `Failed to upload image: ${error.message}`,
        );
      });

    // Update the activity with the image URL
    try {
      activity.eventCoverPhoto = imageUrl;
      await activity.save();
    } catch (error) {
      throw new BadRequestException(
        `Failed to update activity with image URL: ${error.message}`,
      );
    }

    return activity;
  }

  /**
   * Delete a cover image from an activity.
   * Removes the image from S3 and updates the activity to remove the image URL.
   * @param activityId - The ID of the activity.
   * @returns The updated activity with the cover image URL removed.
   * @throws {BadRequestException} If the activity ID is invalid or the image deletion fails.
   * @throws {NotFoundException} If the activity is not found.
   */
  async deleteCoverImage(activityId: string): Promise<Activity> {
    const isValidId = mongoose.isValidObjectId(activityId);
    if (!isValidId) {
      throw new BadRequestException('Invalid activity ID.');
    }

    const activity = await this.activityModel.findById(activityId).exec();
    if (!activity) {
      throw new NotFoundException('Activity not found!');
    }

    // Extract the S3 key from the image URL
    const imageKey = activity.eventCoverPhoto.split('/').pop();

    // Delete the image from S3
    await this.s3Service.deleteFile(imageKey).catch((error) => {
      throw new BadRequestException(
        `Failed to delete existing image: ${error.message}`,
      );
    });

    // Remove the image URL from the activity
    activity.eventCoverPhoto = null;

    await activity.save();

    return activity;
  }

  /**
   * Add a document to an activity.
   * Uploads the document to S3 and updates the activity with the document URL.
   *
   * @param activityId - The ID of the activity.
   * @param document - The document file to upload.
   * @returns The updated activity with the document URL.
   * @throws {BadRequestException} If the activity ID is invalid or the document upload fails.
   * @throws {NotFoundException} If the activity is not found.
   */
  async addDocument(
    activityId: string,
    document: Express.Multer.File,
  ): Promise<Activity> {
    const isValidId = mongoose.isValidObjectId(activityId);
    if (!isValidId) {
      throw new BadRequestException('Invalid activity ID.');
    }

    const activity = await this.activityModel.findById(activityId).exec();
    if (!activity) {
      throw new NotFoundException('Activity not found!');
    }

    // If a document already exists, delete it from S3
    if (activity.eventDocument) {
      const existingDocumentKey = activity.eventDocument.split('/').pop();
      await this.s3Service.deleteFile(existingDocumentKey).catch((error) => {
        throw new BadRequestException(
          `Failed to delete existing document: ${error.message}`,
        );
      });
    }

    // Upload the document to S3 and get the URL
    const documentUrl = await this.s3Service
      .uploadFile(document, 'documents')
      .catch((error) => {
        throw new BadRequestException(
          `Failed to upload document: ${error.message}`,
        );
      });

    // Update the activity with the document URL
    try {
      activity.eventDocument = documentUrl;
      await activity.save();
    } catch (error) {
      throw new BadRequestException(
        `Failed to update activity with document URL: ${error.message}`,
      );
    }

    return activity;
  }
  /**
   * Delete a document from an activity.
   * Removes the document from S3 and updates the activity to remove the document URL.
   * @param activityId - The ID of the activity.
   * @returns The updated activity with the document URL removed.
   * @throws {BadRequestException} If the activity ID is invalid or the document deletion fails.
   * @throws {NotFoundException} If the activity is not found.
   */
  async deleteDocument(activityId: string): Promise<Activity> {
    const isValidId = mongoose.isValidObjectId(activityId);
    if (!isValidId) {
      throw new BadRequestException('Invalid activity ID.');
    }

    const activity = await this.activityModel.findById(activityId).exec();
    if (!activity) {
      throw new NotFoundException('Activity not found!');
    }

    // Extract the S3 key from the document URL
    const documentKey = activity.eventDocument.split('/').pop();

    // Delete the document from S3
    await this.s3Service.deleteFile(documentKey).catch((error) => {
      throw new BadRequestException(
        `Failed to delete existing document: ${error.message}`,
      );
    });

    // Remove the document URL from the activity
    activity.eventDocument = null;

    await activity.save();

    return activity;
  }
}
