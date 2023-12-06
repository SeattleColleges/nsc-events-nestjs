import { IsString, IsOptional, Length } from 'class-validator';

export class AttendeeDto {
  @IsString()
  @IsOptional()
  @Length(1, 50)
  firstName?: string;

  @IsString()
  @IsOptional()
  @Length(1, 50)
  lastName?: string;
}

export class AttendEventDto {
  @IsOptional()
  attendee?: AttendeeDto;
}
