import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { EventRegistrationService } from '../services/event-registration.service';
import { AttendeeDto } from '../dto/attendEvent.dto';

@Controller('event-registration')
export class EventRegistrationController {
  constructor(private readonly registrationService: EventRegistrationService) {}

  @Post('attend')
  async registerAttendee(
    @Body() attendObj: AttendeeDto,
  ) {
    return this.registrationService.attendEvent(attendObj);
  }

  @Delete('unattend')
  async unregisterAttendee(@Body() body: { userId: string, eventId: string }) {
    const { userId, eventId } = body;
    return this.registrationService.deleteAttendee(userId, eventId);
  }

  @Get('event/:eventId')
  async getAttendeesForEvent(@Param('eventId') eventId: string) {
    return this.registrationService.findByEvent(eventId);
  }

  @Get('user/:userId')
  async getEventsForUser(@Param('userId') userId: string) {
    return this.registrationService.findByUser(userId);
  }
}
