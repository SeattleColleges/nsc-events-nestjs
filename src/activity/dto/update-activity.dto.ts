import { SocialMedia } from '../schemas/activity.schema';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  IsBoolean,
  ValidateIf,
} from 'class-validator';
import { IsTime } from '../../../custom-validators/is-time';
import { IsSocialMedia } from '../../../custom-validators/is-social-media';
import { User } from '../../auth/schemas/userAuth.model';

export class UpdateActivityDto {
  @IsEmpty({ message: 'You cannot pass user id.' })
  readonly createdByUser: User;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly eventTitle: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly eventDescription: string;

  // NO LONGER NEEDED
  /*
  @IsOptional()
  @IsNotEmpty()
  @IsString() //TODO: lead dev talk to PO and turn this into enum
  readonly eventCategory: string;
  */

  @IsOptional()
  @IsDateString()
  readonly eventDate: Date;

  @IsOptional()
  @IsTime()
  readonly eventStartTime: string;

  @IsOptional()
  @IsTime()
  readonly eventEndTime: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly eventLocation: string;

  @ValidateIf((obj) => obj.eventCoverPhoto !== undefined && obj.eventCoverPhoto!== '')
  @IsUrl() // TODO: look into options to ensure it has a https prefix
  readonly eventCoverPhoto?: string;

  @ValidateIf((obj) => obj.eventDocument !== undefined && obj.eventDocument !== '')
  @IsUrl()
  readonly eventDocument?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly eventHost: string;

  @ValidateIf((obj) => obj.eventMeetingURL !== undefined && obj.eventMeetingURL !== '')
  @IsOptional()
  @IsUrl()
  readonly eventMeetingURL?: string;

  @IsOptional()
  @IsString()
  readonly eventRegistration?: string;

  @IsOptional()
  @IsNumberString()
  readonly eventCapacity: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  readonly eventTags: string[];

  @IsOptional()
  @IsString()
  readonly eventSchedule?: string;

  @IsOptional()
  @IsArray({
    message:
      "eventSpeakers must be an array. Did you mean to enter ['speaker']?",
  })
  @IsString({
    each: true,
  })
  readonly eventSpeakers?: string[];

  @IsOptional()
  @IsString()
  readonly eventPrerequisites?: string;

  @IsOptional()
  @IsString()
  readonly eventCancellationPolicy?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Be sure to enter club email or a point of contact.' })
  @IsEmail()
  readonly eventContact: string;

  @IsOptional()
  @IsSocialMedia()
  readonly eventSocialMedia: SocialMedia;

  @IsOptional()
  @IsString()
  readonly eventPrivacy?: string;

  @IsOptional()
  @IsString()
  readonly eventAccessibility?: string;

  @IsOptional()
  @IsString()
  readonly eventNote: string;

  @IsOptional()
  @IsBoolean()
  readonly isHidden: boolean;

  @IsOptional()
  @IsBoolean()
  readonly isArchived: boolean;
}
