import { Controller, Get } from '@nestjs/common';

@Controller('event')
export class EventController {

    @Get('')
    getEvent() {
        return {
            id: 1,
            email: 'taylor@gmail.com',
            createdAt: new Date(),
        }
    }
}
