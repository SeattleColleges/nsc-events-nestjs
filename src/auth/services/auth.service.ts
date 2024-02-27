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
import { MailService } from '@sendgrid/mail';

@Injectable()
export class AuthService {
  private role: any;
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { firstName, lastName, pronouns, email, password, role } = signUpDto;

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
    console.log('pronouns: ', pronouns);
    console.log('email: ', email);
    console.log('password: ', password);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('hashedPassword: ', hashedPassword);
    const user = await this.userModel.create({
      firstName,
      lastName,
      pronouns,
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

    // generate new password
    const newPassword = Math.random().toString(36).slice(-8);

    // update user password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userModel.updateOne(
      {
        email,
      },
      {
        password: hashedPassword,
      },
    );
    // send new password to user
    const mailService = new MailService();
    mailService.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: email, // For testing purposes, replace with your email to see the email
      from: process.env.SENDER_EMAIL,
      subject: 'Reset Password',
      html: `<p>Your new password is <strong>${newPassword}</strong>. <br> Please change your password after logging in</p>`,
    };

    mailService
      .send(msg)
      .then(() => {
        console.log('Email sent');
      })
      .catch((error) => {
        console.error(error);
      });

    return { message: 'Password reset successfully' };
  }
}
