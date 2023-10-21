import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../../services/user/user.service';

const mockUserService = {
  adminAddUser: jest.fn().mockResolvedValue('someId'),
  adminUpdateUser: jest.fn().mockResolvedValue(null),
  adminDeleteUser: jest.fn().mockResolvedValue(null),
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    jest.clearAllMocks();
  });

  describe('Admin CRUD operations', () => {
    it('should add, update, and delete a user', async () => {
      const name = 'test';
      const email = 'jeremy@gmail.com';
      const password = '1234567890';
      const role: any = 'admin';
      const updatedName = 'updatedName';
      const req = { user: { role: 'admin' } };

      // Create
      const generatedId = await controller.adminAddUser(
        name,
        email,
        password,
        role,
        req,
      );
      // Expecting the mock to return 'someId'
      expect(generatedId.id).toEqual('someId');
      expect(mockUserService.adminAddUser).toHaveBeenCalledWith(
        name,
        email,
        password,
        role,
      );

      // Update
      await controller.adminUpdateUser(
        generatedId.id,
        updatedName,
        email,
        role,
        req,
      );
      expect(mockUserService.adminUpdateUser).toHaveBeenCalledWith(
        generatedId.id,
        updatedName,
        email,
        role,
      );

      // Delete
      await controller.adminDeleteUser(generatedId.id, req);
      expect(mockUserService.adminDeleteUser).toHaveBeenCalledWith(
        generatedId.id,
      );
    }, 30000);
  });
});
