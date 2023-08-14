import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../../services/user/user.service';
import { Role } from '../../types/user.model';

describe('UserController', () => {
  let controller: UserController;
  let mockUserService;

  const mockUsers = [
    { id: '1', name: 'Alice', email: 'alice@example.com', role: 'user' },
    { id: '2', name: 'Bob', email: 'bob@example.com', role: 'admin' },
    // Add more mock users as needed
  ];

  beforeEach(async () => {
    mockUserService = {
      addUser: jest
        .fn()
        .mockImplementation((name, email, role) => Promise.resolve('some_id')),
      getAllUsers: jest.fn().mockReturnValue(mockUsers), // Define getAllUsers here
      getUserById: jest
        .fn()
        .mockImplementation((id) => mockUsers.find((user) => user.id === id)),
      getUserByEmail: jest.fn().mockReturnValue('some_email'),
      updateUser: jest
        .fn()
        .mockImplementation((id, name, email, role) => Promise.resolve()),
      removeUser: jest.fn(),
    };

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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should add a user', async () => {
    const name = 'John';
    const email = 'john@example.com';
    const role = 'user';
    const result = await controller.addUser(name, email, role);
    expect(result.id).toEqual('some_id');
    expect(mockUserService.addUser).toHaveBeenCalledWith(name, email, role);
  });

  it('should get all users', async () => {
    mockUserService.getAllUsers = jest.fn().mockReturnValue(mockUsers);
    const users = await controller.getAllUsers();
    expect(users).toEqual(mockUsers);
  });

  it('should get user by ID', async () => {
    const userId = '1';
    const user = await controller.getUserById(userId);
    expect(user).toEqual(mockUsers[0]);
    expect(mockUserService.getUserById).toHaveBeenCalledWith(userId);
  });

  it('should get user by email', async () => {
    const email = 'alice@example.com';
    const user = await controller.getUserByEmail(email);
    expect(user).toEqual('some_email');
    expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(email);
  });

  it('should update a user', async () => {
    const id = '1';
    const name = 'Updated Name';
    const email = 'updated@example.com';
    const role = Role.Admin;
    await controller.updateUser(id, name, email, role);
    expect(mockUserService.updateUser).toHaveBeenCalledWith(
      id,
      name,
      email,
      role,
    );
  });
});
