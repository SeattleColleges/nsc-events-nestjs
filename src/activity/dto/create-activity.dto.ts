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
  @IsString()
  readonly eventCategory: string;

  @IsNotEmpty()
  @IsDateString()
  readonly eventDate: Date;

  @IsNotEmpty()
  @IsTime()
  readonly eventStartTime: string;

  @IsNotEmpty()
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
  @IsString()
  readonly eventCost: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  readonly eventTags: string[];

  @IsOptional()
  @IsString()
  readonly eventSchedule: string;

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
  @IsString()
  readonly eventPrerequisites: string;

  @IsOptional()
  @IsString()
  readonly eventCancellationPolicy: string;

  @IsNotEmpty({ message: 'Be sure to enter club email or a point of contact.' })
  @IsEmail()
  readonly eventContact: string;

  @IsOptional()
  @IsSocialMedia()
  readonly eventSocialMedia: SocialMedia;

  @IsOptional()
  @IsString()
  readonly eventPrivacy: string;

  @IsNotEmpty()
  @IsString()
  readonly eventAccessibility: string;
}
