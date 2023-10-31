import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../../services/user/user.service';
import { Role } from '../../../auth/schemas/userAuth.model';

type MockCreateUserDto = {
  id: string;
  email: string;
  name: string;
  password: string;
  role: Role;
};

const mockUserService = {
  newUser: jest.fn().mockResolvedValue('someId'),
  updateUser: jest.fn().mockResolvedValue(null),
  removeUser: jest.fn().mockResolvedValue(null),
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
    const mockRequest = { user: { role: 'admin' } };
    const mockUser: MockCreateUserDto = {
      id: 'testId',
      name: 'test',
      email: 'jeremy@gmail.com',
      password: '1234567890',
      role: Role.admin,
    };

    it('should add a user', async () => {
      const result = await controller.adminAddUser(mockUser, mockRequest);
      expect(result.id).toEqual('someId');
      expect(mockUserService.newUser).toHaveBeenCalledWith(mockUser);
    });

    it('should update a user', async () => {
      const updatedName = 'updatedName';
      mockUser.name = updatedName;

      await controller.updateUser(
        mockUser.id,
        mockUser.name,
        mockUser.email,
        mockUser.role,
      );
      await controller.updateUser(
        mockUser.id,
        mockUser.name,
        mockUser.email,
        mockUser.role,
      );
    });

    it('should delete a user', async () => {
      await controller.adminDeleteUser(mockUser.id, mockRequest);
      expect(mockUserService.removeUser).toHaveBeenCalledWith(mockUser.id);
    });
  });
});
