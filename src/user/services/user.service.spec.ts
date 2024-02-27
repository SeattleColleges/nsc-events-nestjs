import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user/user.service';
import { Model } from 'mongoose';
import { Role, UserDocument } from '../schemas/user.model';
import { getModelToken } from '@nestjs/mongoose';
import { HttpException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let model: Model<UserDocument>;

  const mockUserModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const mockUser = {
    id: 'idString',
    firstName: 'firstNameString',
    lastName: 'lastNameString',
    pronouns: 'pronounsString',
    email: 'emailString',
    role: Role.admin,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<UserDocument>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('model should be defined', () => {
    expect(model).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should call find on the model and return a result', async () => {
      jest.spyOn(model, 'find').mockImplementation(
        () =>
          ({
            exec: jest.fn().mockResolvedValue([mockUser]),
          }) as any,
      );
      const result = await service.getAllUsers();
      expect(model.find).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('getUserById', () => {
    it('should call findById on the model and return a result', async () => {
      jest.spyOn(model, 'findById').mockImplementation(
        () =>
          ({
            exec: jest.fn().mockResolvedValue(mockUser),
          }) as any,
      );
      const result = await service.getUserById(mockUser.id);
      expect(model.findById).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockUser);
    });
    it('should return a Http Exception when model returns null', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      await expect(service.getUserById(mockUser.id)).rejects.toThrow(
        HttpException,
      );
      expect(model.findById).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('getUserByEmail', () => {
    it('should call findOne on the model and return a result', async () => {
      jest.spyOn(model, 'findOne').mockImplementation(
        () =>
          ({
            exec: jest.fn().mockResolvedValue(mockUser),
          }) as any,
      );
      const result = await service.getUserByEmail(mockUser.email);
      expect(model.findOne).toHaveBeenCalledWith({ email: mockUser.email });
      expect(result).toEqual(mockUser);
    });
    it('should return a Http Exception when model returns null', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      await expect(service.getUserByEmail(mockUser.email)).rejects.toThrow(
        HttpException,
      );
      expect(model.findOne).toHaveBeenCalledWith({ email: mockUser.email });
    });
  });

  describe('updateUser', () => {
    it('should call findByIdAndUpdate on the model and return a result', async () => {
      const updatedUser = {
        ...mockUser,
        firstName: 'Updated First Name',
        lastName: 'Updated Last Name',
      } as UserDocument;
      jest.spyOn(model, 'findByIdAndUpdate').mockImplementation(
        () =>
          ({
            exec: jest.fn().mockResolvedValue(updatedUser),
          }) as any,
      );
      const result = await service.updateUser(mockUser.id, updatedUser);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        mockUser.id,
        updatedUser,
        {
          new: true,
          runValidators: true,
        },
      );
      expect(result).toEqual(updatedUser);
    });
    it('should return a HttpException when a User is not provided', async () => {
      await expect(service.updateUser(mockUser.id, null)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('removeUser', () => {
    it('should call findByIdAndDelete on the model', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockImplementation(
        () =>
          ({
            exec: jest.fn().mockResolvedValue(mockUser),
          }) as any,
      );
      await service.removeUser(mockUser.id);
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockUser.id);
    });
    it('should return a Error when model returns null', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      await expect(service.removeUser(mockUser.id)).rejects.toThrow(Error);
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockUser.id);
    });
  });
});
