import { Controller, Get } from '@nestjs/common';
import { ActivityService } from 'src/activity/services/activity/activity.service';

@Controller('activity')
export class ActivityController {
    constructor(private readonly activityService: ActivityService) {}
    
    @Get('')
    async getAllActivities() {
        return await this.activityService.getAllActivities();
    }
}
