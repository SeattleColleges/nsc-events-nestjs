import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  // private so it is only accessed within this class
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Get('/login')
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }

  @Post('admindelete')
  async deleteUser(@Body('email') userEmail: string, @Req() req): Promise<any> {
    const token = req.headers.authorization.split(' ')[1];
    await this.authService.adminDeleteUser(userEmail, token);
    return { success: true, message: 'User successfully deleted.' };
  }

  @Post('adminadduser')
  async adminAddUser(@Body() signUpDto: SignUpDto, @Req() req): Promise<any> {
    const token = req.headers.authorization.split(' ')[1];
    const user = await this.authService.adminAddUser(signUpDto, token);
    return { success: true, message: 'User successfully added.', user };
  }
}
