import { CreateActivityDto } from '../../src/activity/dto/create-activity.dto';

const createMockActivity: CreateActivityDto = {
  createdByUser: undefined,
  eventTitle: 'Sample Event',
  eventDescription: 'This is a sample event description.',
  eventCategory: 'Tech',
  eventDate: new Date('8-15-2023'),
  eventStartTime: '10:00 AM',
  eventEndTime: '4:00 PM',
  eventLocation: '123 Main Street, City',
  eventCoverPhoto: 'https://example.com/event-cover.jpg',
  eventHost: 'Sample Organization',
  eventWebsite: 'https://example.com/sample-event',
  eventRegistration: 'Register at https://example.com/registration',
  eventCapacity: '100',
  eventCost: '$10',
  eventTags: ['Tech', 'Conference', 'Networking'],
  eventSchedule: '10:00 AM - Registration\n11:00 AM - Keynote\n12:00 PM - Lunch\n2:00 PM - Workshops\n4:00 PM - Closing Remarks',
  eventSpeakers: ['John Doe', 'Jane Smith'],
  eventPrerequisites: 'None',
  eventCancellationPolicy: 'Full refund if canceled at least 7 days before the event.',
  eventContact: 'contact@example.com',
  eventSocialMedia: {
    facebook: 'https://www.facebook.com/sampleevent',
    twitter: 'https://twitter.com/sampleevent',
    instagram: 'https://www.instagram.com/sampleevent',
    hashtag: '#SampleEvent2023',
    linkedin: 'https://www.linkedin/in/sampleProfile',
  },
  eventPrivacy: 'Public',
  eventAccessibility: 'Wheelchair accessible venue.',
  isHidden: false,
};

export default createMockActivity;

