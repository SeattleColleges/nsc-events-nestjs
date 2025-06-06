const mockActivityFromDB = {
  _id: '64f4fb4f18500161673ba4ac',
  eventCreatorId: '11f4fb4f18500161673ba4ac',
  eventTitle: 'Sample Event',
  eventDescription: 'This is a sample event description.',
  // eventCategory: 'Tech', // no longer needed
  eventDate: new Date('8-15-2023'),
  eventStartTime: '10:00 AM',
  eventEndTime: '4:00 PM',
  eventLocation: '123 Main Street, City',
  eventMeetingURL: 'https://zoom.us/sample-url',
  eventCoverPhoto: 'https://example.com/event-cover.jpg',
  eventDocument: 'https://example.com/event-document.pdf',
  eventHost: 'Sample Organization',
  eventRegistration: 'Register at https://example.com/registration',
  eventCapacity: '100',
  eventTags: ['Tech', 'Conference', 'Networking'],
  eventSchedule:
    '10:00 AM - Registration\n11:00 AM - Keynote\n12:00 PM - Lunch\n2:00 PM - Workshops\n4:00 PM - Closing Remarks',
  eventSpeakers: ['John Doe', 'Jane Smith'],
  eventPrerequisites: 'None',
  eventCancellationPolicy:
    'Full refund if canceled at least 7 days before the event.',
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
  eventNote: 'This is a sample note.',
  createdAt: '2023-09-03T21:31:59.362Z',
  updatedAt: '2023-09-03T21:31:59.362Z',
  __v: 0,
};

export default mockActivityFromDB;
