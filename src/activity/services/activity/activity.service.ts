import { Injectable } from '@nestjs/common';

@Injectable()
export class ActivityService {
    getActivity() {
        return {
            id: 1,
            email: 'taylor@gmail.com',
            createdAt: new Date(),
        }
    } 
}
