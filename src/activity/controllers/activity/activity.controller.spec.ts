// import { Test, TestingModule } from '@nestjs/testing';
// import { ActivityController } from './activity.controller';
// import { ActivityService } from '../../services/activity/activity.service';
// import mockActivityFromDB from '../../../../test/mock-data/returned-mock-activity';
//
// describe('ActivityController', () => {
//   let controller: ActivityController;
//   let mockActivityService: {
//     updateActivity: any;
//     getAllActivities?: jest.Mock<any, any, any>;
//     getActivityById?: jest.Mock<any, any, any>;
//     addEvent?: jest.Mock<any, any, any>;
//   };
//
//   const mockActivities = [mockActivityFromDB]; // Using mockActivity as the object within mockActivities
//
//   beforeEach(async () => {
//     mockActivityService = {
//       getAllActivities: jest.fn().mockReturnValue(mockActivities),
//       getActivityById: jest.fn().mockReturnValue(mockActivityFromDB),
//       addEvent: jest.fn().mockReturnValue('some_id'),
//       updateActivity: jest.fn().mockReturnValue(null),
//     };
//
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [ActivityController],
//       providers: [
//         {
//           provide: ActivityService,
//           useValue: mockActivityService,
//         },
//       ],
//     }).compile();
//
//     controller = module.get<ActivityController>(ActivityController);
//   });
//
//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
//
//   it('should get all activities', async () => {
//     const activities = await controller.getAllActivities({});
//     expect(activities).toEqual(mockActivities);
//   });
//
//   it('should get activity by ID', async () => {
//     const id = 'some_id';
//     const activity = await controller.findActivityById(id);
//     expect(activity).toEqual(mockActivityFromDB);
//   });
//
//   it('should add an event', async () => {
//     const newEvent = await controller.addEvent(mockActivityFromDB);
//     console.log(newEvent);
//     expect(newEvent.eventCreatorId).toEqual('user-guid');
//   });
//
//   it('should update an activity', async () => {
//     const id = 'some_id';
//     await controller.updateActivityById(id, mockActivityFromDB);
//     expect(mockActivityService.updateActivity).toHaveBeenCalledWith(
//       id,
//       mockActivityFromDB,
//     );
//   });
// });
