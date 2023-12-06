import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';
import { SignUpDto } from '../dto/signup.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  // private so it is only accessed within this class
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
    ) {}

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }

  // forgot password route
  @Post('/forgot-password')
  forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ newToken: string }> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }
}