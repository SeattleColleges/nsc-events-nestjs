import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { UserDocument, Role } from '../../types/user.model';

describe('UserService', () => {
  let service: UserService;
  let mockModel;

  beforeEach(async () => {
    mockModel = jest.fn().mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({ _id: 'some_id' }),
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add a user', async () => {
    const result = await service.addUser('name', 'email@example.com', 'user');
    expect(result).toBeDefined();
    expect(result).toBe('some_id');
  });

  // Other tests remain the same
});
