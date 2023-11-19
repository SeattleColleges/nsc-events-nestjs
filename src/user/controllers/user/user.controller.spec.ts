import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../../services/user/user.service';
import { Role, UserDocument } from '../../schemas/user.model';
import { UpdateUserDto } from '../../dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    newUser: jest.fn(),
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    getUserByEmail: jest.fn(),
    updateUser: jest.fn(),
    removeUser: jest.fn(),
  };

  const mockUser = {
    id: 'testId',
    name: 'test',
    email: 'jeremy@gmail.com',
    password: '1234567890',
    role: Role.admin,
  } as unknown as UserDocument;

  const mockUpdateUserDto = {
    id: 'updatedId',
    name: 'updatedName',
    email: 'updatedEmail',
    role: Role.creator,
  } as unknown as UpdateUserDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: 'USER_SERVICE',
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>('USER_SERVICE');
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should call getAllUsers on the service and return a result', async () => {
      jest.spyOn(service, 'getAllUsers').mockResolvedValue([mockUser]);
      const result = await controller.getAllUsers();
      expect(service.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('getUserById', () => {
    it('should call getUserById on the service and return a result', async () => {
      jest.spyOn(service, 'getUserById').mockResolvedValue(mockUser);
      const result = await controller.getUserById(mockUser.id);
      expect(service.getUserById).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockUser);
    });
  });

  describe('getUserByEmail', () => {
    it('should call getUserByEmail on the service and return a result', async () => {
      jest.spyOn(service, 'getUserByEmail').mockResolvedValue(mockUser);
      const result = await controller.getUserByEmail(mockUser.email);
      expect(service.getUserByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(result).toEqual(mockUser);
    });
  });

  // this should use a DTO
  describe('updateUser', () => {
    it('should call updateUser on the service', async () => {
      jest.spyOn(service, 'updateUser').mockImplementation();
      await controller.updateUser(mockUser.id, mockUpdateUserDto);
      expect(service.updateUser).toHaveBeenCalledWith(
        mockUser.id,
        mockUpdateUserDto,
      );
    });
  });

  describe('adminDeleteUser', () => {
    it('should call removeUser on the service', async () => {
      jest.spyOn(service, 'removeUser').mockImplementation();
      await controller.adminDeleteUser(mockUser.id);
      expect(service.removeUser).toHaveBeenCalledWith(mockUser.id);
    });
  });
});
