import { Controller, Get } from '@nestjs/common';

@Controller('activity')
export class ActivityController {

    @Get('')
    getActivity() {
        return {
            id: 1,
            email: 'taylor@gmail.com',
            createdAt: new Date(),
        }
    }
}
