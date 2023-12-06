import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';
import { SignUpDto } from '../dto/signup.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { Role } from '../schemas/userAuth.model'; 

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService= {
    signUp: jest.fn(),
    login: jest.fn(),
    forgotPassword: jest.fn()
  }
  const mockSignUpDto: SignUpDto = {
    name: 'Test User',
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
        provide: 'AUTH_SERVICE',
        useValue:  mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>('AUTH_SERVICE');
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should return a token', async () => {
      const result = { token: 'your-test-token' };

      jest.spyOn(authService, 'signUp').mockResolvedValue(result);

      expect(await authController.signUp(mockSignUpDto)).toBe(result);
    });
  });

  describe('login', () => {
    it('should return a token', async () => {
      const result = { token: 'your-test-token' };

      jest.spyOn(authService, 'login').mockResolvedValue(result);

      expect(await authController.login(mockLoginDto)).toBe(result);
    });
  });

  describe('forgotPassword', () => {
    it('should return a new token', async () => {
      const result = { newToken: 'your-test-token' };

      jest.spyOn(authService, 'forgotPassword').mockResolvedValue(result);

      expect(await authController.forgotPassword(mockForgotPasswordDto)).toBe(result);
    });
  });
});

