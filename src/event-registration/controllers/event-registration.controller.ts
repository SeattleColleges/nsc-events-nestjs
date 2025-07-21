import { Controller, Post, Body, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { EventRegistrationService } from '../services/event-registration.service';
import { AttendeeDto } from '../dto/attendEvent.dto';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

// @UseGuards(AuthGuard('jwt')) - keep for now, might remove later
@Controller('event-registration')
export class EventRegistrationController {
  constructor(private readonly registrationService: EventRegistrationService) {}

  // endpoint to register a user for an event
  @UseGuards(JwtAuthGuard)
  @Post('attend')
  async registerAttendee(
    @Body() attendObj: AttendeeDto,
  ) {
    return this.registrationService.attendEvent(attendObj);
  }

  // endpoint to unregister a user from an event
  @UseGuards(JwtAuthGuard)
  @Delete('unattend')
  async unregisterAttendee(@Body() body: { userId: string, eventId: string }) {
    const { userId, eventId } = body;
    return this.registrationService.deleteAttendee(userId, eventId);
  }

  // endpoint to check if a user is attending an event
  @UseGuards(JwtAuthGuard)
  @Get('is-attending/:eventId/:userId')
  async isAttendingEvent(@Param('eventId') eventId: string, @Param('userId') userId: string) {
    return this.registrationService.isAttendingEvent(eventId, userId);
  }

  // endpoint to get all attendees signed up for an event
  @Get('event/:eventId/')
  @Public() // Custom decorator to skip AuthGuard, allowing public access
  async getAttendeesForEvent(@Param('eventId') eventId: string) {
    const attendees = await this.registrationService.findByEvent(eventId);
    // console.log('Attendees fetched:', attendees);
    return attendees;
  }

  // endpoint to get all events being attended by a user
  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async getEventsForUser(@Param('userId') userId: string) {
    return this.registrationService.findByUser(userId);
  }
}
