import { Body, Controller, Get, Post } from '@nestjs/common';
import { ActivityService } from 'src/activity/services/activity/activity.service';

@Controller('activity')
export class ActivityController {
    constructor(private readonly activityService: ActivityService) {}
    
    @Get('')
    async getAllActivities() {
        return await this.activityService.getAllActivities();
    }

    @Post('add')
    async addEvent(
        @Body('eventTitle') eventTitle: string,
        @Body('eventCategory') eventCategory: string,
        @Body('eventTags') eventTags: string[],
    ) {
        const newEvent = await this.activityService.addEvent(eventTitle,eventCategory,eventTags);
        console.log(newEvent);
        return { id: newEvent };
    }
}
