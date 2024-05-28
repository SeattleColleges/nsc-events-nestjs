import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ActivityService } from '../../services/activity/activity.service';
import { Activity } from '../../schemas/activity.schema';
import { CreateActivityDto } from '../../dto/create-activity.dto';
import { UpdateActivityDto } from '../../dto/update-activity.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../../../auth/schemas/userAuth.model';
import { AttendEventDto } from '../../dto/attend-event.dto';
@Controller('events')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}
  @Get('')
  async getAllActivities(
    @Query() query: ExpressQuery,
  ): Promise<Activity[]> {
    return await this.activityService.getAllActivities(query);
  }
  @Get('find/:id')
  async findActivityById(@Param('id') id: string): Promise<Activity> {
    return this.activityService.getActivityById(id);
  }
  // request all events created by a specific user
  @Get('user/:userId')
  async getActivitiesByUserId(
    @Param('userId') userId: string,
  ): Promise<Activity[]> {
    return this.activityService.getActivitiesByUserId(userId);
  }

  @Post('attend/:id')
  @UseGuards(AuthGuard())
  // TODO: rate limit this so you can't spam this route
  async attendEvent(
    @Param('id') eventId: string,
    @Body() attendEventDto: AttendEventDto,
  ) {
    return await this.activityService.attendEvent(eventId, attendEventDto);
  }

  @Post('new')
  @UseGuards(AuthGuard())
  async addEvent(
    @Body() activity: CreateActivityDto,
    @Req() req: any,
  ): Promise<{ activity: Activity; message: string }> {
    console.log(req.user);
    if (req.user.role != Role.user) {
      return await this.activityService.createEvent(activity, req.user);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Put('update/:id')
  @UseGuards(AuthGuard())
  async updateActivityById(
    @Param('id') id: string,
    @Body() activity: UpdateActivityDto,
    @Req() req: any,
  ): Promise<{ updatedActivity: Activity; message: string }> {
    // return activity to retrieve createdByUser property value
    const preOperationActivity = await this.activityService.getActivityById(id);
    // admin can make edits regardless
    if (req.user.role === Role.admin) {
      return await this.activityService.updateActivityById(id, activity);
    }
    // have to check if they are the creator and if they still have creator access
    if (
      preOperationActivity.createdByUser.equals(req.user._id) &&
      req.user.role === Role.creator
    ) {
      return await this.activityService.updateActivityById(id, activity);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Delete('remove/:id')
  @UseGuards(AuthGuard())
  async deleteActivityById(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<{ deletedActivity: Activity; message: string }> {
    const preOperationActivity = await this.activityService.getActivityById(id);
    if (req.user.role === Role.admin) {
      return this.activityService.deleteActivityById(id);
    }
    if (
      preOperationActivity.createdByUser.equals(req.user._id) &&
      req.user.role === Role.creator
    ) {
      return await this.activityService.deleteActivityById(id);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Put('archive/:id')
  @UseGuards(AuthGuard())
  async archiveActivityById(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<{ archivedActivity: Activity; message: string }> {
    const preOperationActivity: Activity =
      await this.activityService.getActivityById(id);
    if (req.user.role === Role.admin) {
      return this.activityService.archiveActivityById(id);
    }
    if (
      preOperationActivity.createdByUser.equals(req.user._id) &&
      req.user.role === Role.creator
    ) {
      return await this.activityService.archiveActivityById(id);
    } else {
      throw new UnauthorizedException();
    }
  }
}
