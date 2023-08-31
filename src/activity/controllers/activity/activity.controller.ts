import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ActivityService } from 'src/activity/services/activity/activity.service';
import { CreateActivityDto } from '../../types/create-activity.dto';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}
  @Get('')
  async getAllActivities() {
    return await this.activityService.getAllActivities();
  }

  @Get(':id')
  async getActivityById(@Param('id') id: string) {
    console.log(id);
    return this.activityService.getActivityById(id);
  }

  @Post('add')
  async addEvent(@Body() createActivityDto: CreateActivityDto) {
    const newEvent = await this.activityService.addEvent(createActivityDto);
    console.log(newEvent);
    return { id: newEvent };
  }

  @Patch('update/:id')
  async updateActivity(
    @Param('id') id: string,
    @Body() createActivityDto: CreateActivityDto,
  ) {
    await this.activityService.updateActivity(id, createActivityDto);
  }
}
