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
import { Role } from '../../../auth/schemas/user.schema';

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
  @UseGuards(AuthGuard())
  async addEvent(
    @Body() activity: CreateActivityDto,
    @Req() req: any,
  ): Promise<Activity> {
    console.log(req.user);
    if (req.user.role != Role.user) {
      return await this.activityService.createEvent(activity, req.user);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Put('update/:id')
  async updateActivityById(
    @Param('id') id: string,
    @Body() activity: UpdateActivityDto,
  ): Promise<Activity> {
    return await this.activityService.updateActivityById(id, activity);
  }

  @Delete('remove/:id')
  async deleteActivityById(@Param('id') id: string): Promise<Activity> {
    return this.activityService.deleteActivityById(id);
  }
}
