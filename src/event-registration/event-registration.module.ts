import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EventRegistration,
  EventRegistrationSchema,
} from './schemas/event-registration.schema';
import { EventRegistrationService } from './services/event-registration.service';
import { EventRegistrationController } from './controllers/event-registration.controller';
import { ActivityModule } from 'src/activity/activity.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EventRegistration.name, schema: EventRegistrationSchema },
    ]),
    ActivityModule,
  ],
  controllers: [EventRegistrationController],
  providers: [EventRegistrationService],
  exports: [EventRegistrationService],
})
export class EventRegistrationModule {}
