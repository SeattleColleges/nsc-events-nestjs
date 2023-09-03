import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ActivityService } from '../../services/activity/activity.service';
import { Activity } from '../../schemas/activity.schema';
import { Types } from 'mongoose';
import { CreateActivityDto } from '../../dto/create-activity.dto';
import { UpdateActivityDto } from '../../dto/update-activity.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('events')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}
  @Get('')
  async getAllActivities(@Query() query: ExpressQuery): Promise<Activity[]> {
    return await this.activityService.getAllActivities(query);
  }

  @Get('find/:id')
  async findActivityById(@Param('id') id: string): Promise<Activity> {
    return this.activityService.getActivityById(id);
  }

  @Post('new')
  async addEvent(
    @Body() activity: CreateActivityDto,
  ): Promise<Activity & { _id: Types.ObjectId }> {
    return await this.activityService.addEvent(activity);
  }

  @Put('update/:id')
  async updateActivityById(
    @Param('id') id: string,
    @Body() activity: UpdateActivityDto,
  ): Promise<Activity & { _id: Types.ObjectId }> {
    return await this.activityService.updateActivityById(id, activity);
  }

  @Delete('remove/:id')
  async deleteActivityById(@Param('id') id: string): Promise<Activity> {
    return this.activityService.deleteActivityById(id);
  }
}
