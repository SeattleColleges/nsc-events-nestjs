import { Controller, Get } from '@nestjs/common';
import { ActivityService } from 'src/activity/services/activity/activity.service';

@Controller('activity')
export class ActivityController {
    constructor(private activityService: ActivityService) {}
    @Get('')
    getActivity() {
        return this.activityService.getActivity();
    }
}
