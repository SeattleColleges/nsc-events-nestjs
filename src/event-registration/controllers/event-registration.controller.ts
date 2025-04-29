import { Controller, Post, Body, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { EventRegistrationService } from '../services/event-registration.service';
import { AttendeeDto } from '../dto/attendEvent.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('event-registration')
export class EventRegistrationController {
  constructor(private readonly registrationService: EventRegistrationService) {}

  // endpoint to register a user for an event
  @Post('attend')
  async registerAttendee(
    @Body() attendObj: AttendeeDto,
  ) {
    return this.registrationService.attendEvent(attendObj);
  }

  // endpoint to unregister a user from an event
  @Delete('unattend')
  async unregisterAttendee(@Body() body: { userId: string, eventId: string }) {
    const { userId, eventId } = body;
    return this.registrationService.deleteAttendee(userId, eventId);
  }

  // endpoint to check if a user is attending an event
  @Get('is-attending/:eventId/:userId')
  async isAttendingEvent(@Param('eventId') eventId: string, @Param('userId') userId: string) {
    return this.registrationService.isAttendingEvent(eventId, userId);
  }

  // endpoint to get all attendees signed up for an event
  @Get('event/:eventId')
  async getAttendeesForEvent(@Param('eventId') eventId: string) {
    return this.registrationService.findByEvent(eventId);
  }

  // endpoint to get all events being attended by a user
  @Get('user/:userId')
  async getEventsForUser(@Param('userId') userId: string) {
    return this.registrationService.findByUser(userId);
  }
}
