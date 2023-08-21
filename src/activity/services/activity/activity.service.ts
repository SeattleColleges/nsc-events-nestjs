import { HttpException, Injectable } from '@nestjs/common';
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

  async getActivityById(id: string): Promise<ActivityDocument> {
    console.log('service id: ', id);
    let activity: ActivityDocument;
    try {
      activity = await this.activityModel.findById(id).exec();
    } catch (error) {
      throw new HttpException('Activity not found!', 404);
    }
    if (!activity) {
      throw new HttpException('Activity not found!', 404);
    }
    return {
      eventCreatorId: activity.eventCreatorId,
      eventTitle: activity.eventTitle,
      eventDescription: activity.eventDescription,
      eventCategory: activity.eventCategory,
      eventDate: activity.eventDate,
      eventStartTime: activity.eventStartTime,
      eventEndTime: activity.eventEndTime,
      eventLocation: activity.eventLocation,
      eventCoverPhoto: activity.eventCoverPhoto,
      eventHost: activity.eventHost,
      eventWebsite: activity.eventWebsite,
      eventRegistration: activity.eventRegistration,
      eventCapacity: activity.eventCapacity,
      eventCost: activity.eventCost,
      eventTags: activity.eventTags,
      eventSchedule: activity.eventSchedule,
      eventSpeakers: activity.eventSpeakers,
      eventPrerequisites: activity.eventPrerequisites,
      eventCancellationPolicy: activity.eventCancellationPolicy,
      eventContact: activity.eventContact,
      eventSocialMedia: activity.eventSocialMedia,
      eventPrivacy: activity.eventPrivacy,
      eventAccessibility: activity.eventAccessibility,
    } as ActivityDocument;
  }

  async addEvent(
    eventCreatorId: string,
    eventTitle: string,
    eventDescription: string,
    eventCategory: string,
    eventDate: Date,
    eventStartTime: string,
    eventEndTime: string,
    eventLocation: string,
    eventCoverPhoto: string,
    eventHost: string,
    eventWebsite: string,
    eventRegistration: string,
    eventCapacity: string,
    eventCost: string,
    eventTags: string[],
    eventSchedule: string,
    eventSpeakers: string[],
    eventPrerequisites: string,
    eventCancellationPolicy: string,
    eventContact: string,
    eventSocialMedia: [],
    eventPrivacy: string,
    eventAccessibility: string,
  ): Promise<any> {
    const newEvent = new this.activityModel({
      eventCreatorId,
      eventTitle,
      eventDescription,
      eventCategory,
      eventDate,
      eventStartTime,
      eventEndTime,
      eventLocation,
      eventCoverPhoto,
      eventHost,
      eventWebsite,
      eventRegistration,
      eventCapacity,
      eventCost,
      eventTags,
      eventSchedule,
      eventSpeakers,
      eventPrerequisites,
      eventCancellationPolicy,
      eventContact,
      eventSocialMedia,
      eventPrivacy,
      eventAccessibility,
    });
    const result = await newEvent.save();
    return result._id;
  }

  async updateActivity(
    id: string,
    eventCreatorId: string,
    eventTitle: string,
    eventDescription: string,
    eventCategory: string,
    eventDate: Date,
    eventStartTime: string,
    eventEndTime: string,
    eventLocation: string,
    eventCoverPhoto: string,
    eventHost: string,
    eventWebsite: string,
    eventRegistration: string,
    eventCapacity: string,
    eventCost: string,
    eventTags: string[],
    eventSchedule: string,
    eventSpeakers: string[],
    eventPrerequisites: string,
    eventCancellationPolicy: string,
    eventContact: string,
    eventSocialMedia: {
      "facebook": string;
      "twitter": string;
      "instagram": string;
      "hashtag": string;
    },
    eventPrivacy: string,
    eventAccessibility: string,
    ) {
    const updatedActivity = await this.activityModel.findById(id).exec();
    if (eventCreatorId) {
      console.log('eventCreatorId ', eventCreatorId);
      updatedActivity.eventCreatorId = eventCreatorId;
    }
    if (eventTitle) {
      console.log('eventTitle ', eventTitle);
      updatedActivity.eventTitle = eventTitle;
    }
    if (eventDescription) {
      console.log('eventDescription ', eventDescription);
      updatedActivity.eventDescription = eventDescription;
    }
    if (eventCategory) {
      console.log('eventCategory ', eventCategory);
      updatedActivity.eventCategory = eventCategory;
    }
    if (eventDate) {
      console.log('eventDate ', eventDate);
      updatedActivity.eventDate = eventDate;
    }
    if (eventStartTime) {
      console.log('eventStartTime ', eventStartTime);
      updatedActivity.eventStartTime = eventStartTime;
    }
    if (eventEndTime) {
      console.log('eventEndTime ', eventEndTime);
      updatedActivity.eventEndTime = eventEndTime;
    }
    if (eventLocation) {
      console.log('eventLocation ', eventLocation);
      updatedActivity.eventLocation = eventLocation;
    }
    if (eventCoverPhoto) {
      console.log('eventCoverPhoto ', eventCoverPhoto);
      updatedActivity.eventCoverPhoto = eventCoverPhoto;
    }
    if (eventHost) {
      console.log('eventHost ', eventHost);
      updatedActivity.eventHost = eventHost;
    }
    if (eventWebsite) {
      console.log('eventWebsite ', eventWebsite);
      updatedActivity.eventWebsite = eventWebsite;
    }
    if (eventRegistration) {
      console.log('eventRegistration ', eventRegistration);
      updatedActivity.eventRegistration = eventRegistration;
    }
    if (eventCapacity) {
      console.log('eventCapacity ', eventCapacity);
      updatedActivity.eventCapacity = eventCapacity;
    }
    if (eventCost) {
      console.log('eventCost ', eventCost);
      updatedActivity.eventCost = eventCost;
    }
    if (eventTags) {
      console.log('eventTags ', eventTags);
      updatedActivity.eventTags = eventTags;
    }
    if (eventSchedule) {
      console.log('eventSchedule ', eventSchedule);
      updatedActivity.eventSchedule = eventSchedule;
    }
    if (eventSpeakers) {
      console.log('eventSpeakers ', eventSpeakers);
      updatedActivity.eventSpeakers = eventSpeakers;
    }
    if (eventPrerequisites) {
      console.log('eventPrerequisites ', eventPrerequisites);
      updatedActivity.eventPrerequisites = eventPrerequisites;
    }
    if (eventCancellationPolicy) {
      console.log('eventCancellationPolicy ', eventCancellationPolicy);
      updatedActivity.eventCancellationPolicy = eventCancellationPolicy;
    }
    if (eventContact) {
      console.log('eventContact ', eventContact);
      updatedActivity.eventContact = eventContact;
    }
    if (eventSocialMedia) {
      console.log('eventSocialMedia ', eventSocialMedia);
      updatedActivity.eventSocialMedia = eventSocialMedia;
    }
    if (eventPrivacy) {
      console.log('eventPrivacy ', eventPrivacy);
      updatedActivity.eventPrivacy = eventPrivacy;
    }
    if (eventAccessibility) {
      console.log('eventAccessibility ', eventAccessibility);
      updatedActivity.eventAccessibility = eventAccessibility;
    }
    const updated = await updatedActivity.save();
    console.log(updated);
    return updated;
  }
}
