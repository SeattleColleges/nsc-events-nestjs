import { SocialMedia } from '../schemas/activity.schema';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { IsTime } from '../../../custom-validators/is-time';
import { IsSocialMedia } from '../../../custom-validators/is-social-media';

export class CreateActivityDto {
  @IsNotEmpty()
  @IsString() // TODO restrict so user cannot set this. Will be included on create of event from user data.
  readonly eventCreatorId: string;

  @IsNotEmpty()
  @IsString()
  readonly eventTitle: string;

  @IsNotEmpty()
  @IsString()
  readonly eventDescription: string;

  @IsNotEmpty()
  @IsString() //TODO: lead dev talk to PO and turn this into enum
  readonly eventCategory: string;

  @IsDateString()
  readonly eventDate: Date;

  @IsTime()
  readonly eventStartTime: string;

  @IsTime()
  readonly eventEndTime: string;

  @IsNotEmpty()
  @IsString()
  readonly eventLocation: string;

  @IsOptional()
  @IsUrl() // TODO: look into options to ensure it has a https prefix
  readonly eventCoverPhoto: string;

  @IsNotEmpty()
  @IsString()
  readonly eventHost: string;

  @IsOptional()
  @IsUrl() // TODO: look into options to ensure it has a https prefix
  readonly eventWebsite: string;

  @IsNotEmpty()
  @IsString()
  readonly eventRegistration: string;

  @IsNotEmpty()
  @IsNumberString()
  readonly eventCapacity: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly eventCost: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  readonly eventTags: string[];

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly eventSchedule: string;

  @IsOptional()
  @IsArray({
    message:
      "eventSpeakers must be an array. Did you mean to enter ['speaker']?",
  })
  @ArrayNotEmpty()
  @IsString({
    each: true,
  })
  readonly eventSpeakers: string[];

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly eventPrerequisites: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly eventCancellationPolicy: string;

  @IsNotEmpty({ message: 'Be sure to enter club email or a point of contact.' })
  @IsEmail()
  readonly eventContact: string;

  @IsOptional()
  @IsSocialMedia()
  readonly eventSocialMedia: SocialMedia;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly eventPrivacy: string;

  @IsNotEmpty()
  @IsString()
  readonly eventAccessibility: string;
}
