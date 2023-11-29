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

  const mockSignUpDto = (): SignUpDto => {
    return {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'testpassword123',
      role: Role.user,
    };
  };

  const mockLoginDto = (): LoginDto => {
    return {
      email: 'testuser@example.com',
      password: 'testpassword123',
    };
  };

  const generateForgotPasswordDto = (): ForgotPasswordDto => {
    return {
      email: 'testuser@example.com',
    };
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signUp', () => {
    it('should return a token', async () => {
      const signUpDto: SignUpDto = mockSignUpDto(); 
      const result = { token: 'your-test-token' };

      jest.spyOn(authService, 'signUp').mockResolvedValue(result);

      expect(await authController.signUp(signUpDto)).toBe(result);
    });
  });

  describe('login', () => {
    it('should return a token', async () => {
      const loginDto: LoginDto = mockLoginDto(); 
      const result = { token: 'your-test-token' };

      jest.spyOn(authService, 'login').mockResolvedValue(result);

      expect(await authController.login(loginDto)).toBe(result);
    });
  });

  describe('forgotPassword', () => {
    it('should return a new token', async () => {
      const forgotPasswordDto: ForgotPasswordDto = generateForgotPasswordDto(); 
      const result = { newToken: 'your-test-token' };

      jest.spyOn(authService, 'forgotPassword').mockResolvedValue(result);

      expect(await authController.forgotPassword(forgotPasswordDto)).toBe(result);
    });
  });
});
