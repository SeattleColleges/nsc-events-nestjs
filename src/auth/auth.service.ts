import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/userAuth.model';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private role: any;
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { name, email, password, role } = signUpDto;

    console.log('name: ', name);
    console.log('email: ', email);
    console.log('password: ', password);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('hashedPassword: ', hashedPassword);
    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = this.jwtService.sign({ id: user._id, role: user.role });

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

    const token = this.jwtService.sign({ id: user._id, role: user.role });

    return { token };
  }

  ////////////////////////////////////////////////////
  // Admin routes
  ////////////////////////////////////////////////////
  // Admin add user
  async adminAddUser(signUpDto: SignUpDto, token: string): Promise<User> {
    const { name, email, password, role } = signUpDto;
    // Verify the token
    let decoded;
    try {
      decoded = this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    // Check the user's role
    const userId = decoded.id;
    const requestor = await this.userModel.findById(userId);

    if (!requestor || requestor.role !== 'admin') {
      throw new ForbiddenException('Only admins can add users');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return user;
  }

  // Delete a user by email
  async adminDeleteUser(userEmail: string, token: string): Promise<void> {
    // Decode the token
    let decoded;
    try {
      decoded = this.jwtService.verify(token);
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }

    const requestorId = decoded.id;
    const requestor = await this.userModel.findById(requestorId);

    if (!requestor || requestor.role !== 'admin') {
      throw new UnauthorizedException('Only admins can delete users');
    }

    const result = await this.userModel.deleteOne({ email: userEmail });

    if (result.deletedCount === 0) {
      throw new NotFoundException('User not found');
    }
  }

  // Update creator role
  async adminUpdateCreatorRole(
    userEmail: string,
    token: string,
  ): Promise<void> {
    // Decode our token
    let decoded;
    try {
      decoded = this.jwtService.verify(token);
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }

    const requestorId = decoded.id;
    const requestor = await this.userModel.findById(requestorId);

    if (!requestor || requestor.role !== 'admin') {
      throw new UnauthorizedException('Only admins can update roles');
    }

    const toBeUpdated = await this.userModel.findOne({ email: userEmail });
    const updateResult = await this.userModel.findByIdAndUpdate(
      toBeUpdated,
      { role: 'creator' },
      { new: true },
    );

    if (!updateResult) {
      throw new NotFoundException('User not found');
    } else {
      console.log('updateResult: ', updateResult);
    }
  }
  ////////////////////////////////////////////////////
  //     End Admin routes                           //
  ////////////////////////////////////////////////////
}
