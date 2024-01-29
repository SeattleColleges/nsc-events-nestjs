import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/userAuth.model';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';

@Injectable()
export class AuthService {
  private role: any;
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { firstName, lastName, email, password, role } = signUpDto;

    if (await this.userModel.findOne({ email })) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'User with this email already exists',
        },
        HttpStatus.CONFLICT,
      );
    }

    console.log('firstName: ', firstName);
    console.log('lastName: ', lastName);
    console.log('email: ', email);
    console.log('password: ', password);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('hashedPassword: ', hashedPassword);
    const user = await this.userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    const token = this.jwtService.sign({
      id: user._id,
      role: user.role,
    });

    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    console.log('email: ', email);
    console.log('password: ', password);
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // compares client password to db hashed password: user.password
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({
      id: user._id,
      role: user.role,
      firstName: user.firstName,
    });

    return { token };
  }

  // forgot password function
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    // check if user exists
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new HttpException('User does not exist', 404);
    }

    // generate new Token
    const newToken = this.jwtService.sign({
      message: 'Reset password',
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });

    // we can send the token to the user's email
    // for now, we will just log it to the console
    return { newToken };
  }
}
