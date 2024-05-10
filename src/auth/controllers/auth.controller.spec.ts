import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { SignUpDto } from '../dto/signup.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { Role } from '../schemas/userAuth.model';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signUp: jest.fn(),
    login: jest.fn(),
    forgotPassword: jest.fn(),
  };
  const mockSignUpDto: SignUpDto = {
    firstName: 'Test',
    lastName: 'User',
    pronouns: 'they/them',
    email: 'testuser@example.com',
    password: 'testpassword123',
    role: Role.user,
  };

  const mockLoginDto: LoginDto = {
    email: 'testuser@example.com',
    password: 'testpassword123',
  };

  const mockForgotPasswordDto: ForgotPasswordDto = {
    email: 'testuser@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should return a token', async () => {
      const result = { token: 'your-test-token' };

      jest.spyOn(authService, 'signUp').mockResolvedValue(result);

      expect(await authController.signUp(mockSignUpDto)).toBe(result);
    });
  });

  describe('signUp', () => {
    it('should throw an error for existing email address', async () => {
      const errorMessage = 'Email address already exists';
  
      jest.spyOn(authService, 'signUp').mockRejectedValue(new Error(errorMessage));
      try {
        await authController.signUp(mockSignUpDto);
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });

  describe('login', () => {
    it('should return a token', async () => {
      const result = { token: 'your-test-token' };

      jest.spyOn(authService, 'login').mockResolvedValue(result);

      expect(await authController.login(mockLoginDto)).toBe(result);
    });
  });

  describe('login', () => {
    it('should return an error for invalid credentials', async () => {
      const errorMessage = 'Invalid email or password';
  
      jest.spyOn(authService, 'login').mockResolvedValue(null);

      try {
        await authController.login(mockLoginDto);
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });
  describe('forgotPassword', () => {
    it('should return a successful message', async () => {
      const result = { message: 'Reset passsword link sent to your email' };

      jest.spyOn(authService, 'forgotPassword').mockResolvedValue(result);

      expect(await authController.forgotPassword(mockForgotPasswordDto)).toBe(
        result,
      );
    });
  });
});