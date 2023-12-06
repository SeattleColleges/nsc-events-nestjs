import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, HttpException, HttpStatus} from '@nestjs/common';
import { SignUpDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { Role, User } from '../schemas/userAuth.model';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let authService: AuthService;
  let model: Model<User>;
  let jwtService: JwtService;

  const mockAuthModel = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  const mockUser = {
    _id: '61c0ccf11d7bf83d153d7c06',
    name: 'Test User',
    email: 'testuser@gmail.com',
  };

  let token = 'jwtToken';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getModelToken(User.name),
          useValue: mockAuthModel,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    model = module.get<Model<User>>(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('model should be defined', () => {
    expect(model).toBeDefined();
  });

  describe('signUp', () => {
    const signUpDto: SignUpDto = {
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'testpassword123',
        role: Role.user,
      };

    it('should register the new user', async () => {
        jest.spyOn<any, string>(bcrypt, 'hash').mockResolvedValue('hashedPassword');
        jest
          .spyOn(model, 'create')
          .mockImplementationOnce(() => Promise.resolve([mockUser]) as any);
  
        jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken');

      const result = await authService.signUp(signUpDto);

      expect(bcrypt.hash).toHaveBeenCalled();
      expect(result).toEqual({ token });
    });

    it('should throw duplicate email entered', async () => {
        jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.reject(new Error('Duplicate email entered')));

        await expect(authService.signUp(signUpDto)).rejects.toThrowError('Duplicate email entered');
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
        email: 'testuser@example.com',
        password: 'testpassword123',
      };

    it('should login user and return the token', async () => {
        jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);

        jest.spyOn<any, string>(bcrypt, 'compare').mockResolvedValueOnce(true);
        jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await authService.login(loginDto);

      expect(result).toEqual({ token });
    });

    it('should throw invalid email error', async () => {
        jest.spyOn(model, 'findOne').mockResolvedValueOnce(null);
  
        expect(authService.login(loginDto)).rejects.toThrow(
          UnauthorizedException,
        );
      });
  
      it('should throw invalid password error', async () => {
        jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);
        jest.spyOn<any, string>(bcrypt, 'compare').mockResolvedValueOnce(false);
  
        expect(authService.login(loginDto)).rejects.toThrow(
          UnauthorizedException,
        );
      });
  });

  describe('forgotPassword', () => {
    const forgotPasswordDto: ForgotPasswordDto = {
        email: 'testuser@example.com',
      };
    it('should generate a new token for password reset', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('resetToken');

      const result = await authService.forgotPassword(forgotPasswordDto);

      expect(result).toEqual({ newToken: 'resetToken' });
      expect(jwtService.sign).toHaveBeenCalled();
    });

    it('should throw a 404 error if user does not exist', async () => {
      const forgotPasswordDto: ForgotPasswordDto = {
        email: 'nonexistentuser@example.com',
      };

      jest.spyOn(model, 'findOne').mockResolvedValueOnce(null);

      await expect(authService.forgotPassword(forgotPasswordDto)).rejects.toThrowError(
        new HttpException('User does not exist', HttpStatus.NOT_FOUND),
      );
    });
  });
});
