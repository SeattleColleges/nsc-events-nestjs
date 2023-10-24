/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { Role, UserDocument } from '../../schemas/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { log } from 'console';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {
    // User defined in user.module.ts
  }

  // ----------------- Add user ----------------- \\
  async newUser(createUserDto: CreateUserDto): Promise<string> {
    const { name, email, password, role } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
      role,
    });
    try {
      const result = await newUser.save();
      return result._id;
    } catch (error) {
      log(error);
      return error;
    }
  }

  // ----------------- Get all users ----------------- \\
  async getAllUsers(): Promise<any> {
    //fix: Use serialization to mask password, so we don't have to transform the data
    const users: UserDocument[] = await this.userModel.find().exec();
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }));
  }

  // ----------------- Get user by id ----------------- \\
  async getUserById(id: string): Promise<UserDocument> {
    console.log('service id: ', id);
    let user: UserDocument;
    try {
      user = await this.userModel.findById(id).exec();
    } catch (error) {
      throw new HttpException('User not found!', 404);
    }
    if (!user) {
      throw new HttpException('User not found!', 404);
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    } as UserDocument;
  }

  // ----------------- Get user by email ----------------- \\
  async getUserByEmail(email: string): Promise<UserDocument> {
    let user: UserDocument;
    try {
      user = await this.userModel.findOne({ email: email });
      console.log(user);
    } catch (error) {
      throw new HttpException('User not found!', 404);
    }
    if (!user) {
      throw new HttpException('User not found!', 404);
    }

    return user;
  }

  // ----------------- Update user ----------------- \\
  async updateUser(id: string, name: string, email: string, role: Role) {
    const updatedUser = await this.userModel.findById(id).exec();
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    if (name) {
      updatedUser.name = name;
    }
    if (email) {
      updatedUser.email = email;
    }
    if (role) {
      updatedUser.role = role;
    }

    const updated = await updatedUser.save();
    console.log(updated);
    return updated;
  }

  // ----------------- Delete user ----------------- \\
  async removeUser(id: string): Promise<void> {
    try {
      const user = await this.userModel.findByIdAndDelete(id).exec();

      if (!user) {
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new Error('Error deleting user: ' + error);
    }
  }

  // ================== End Admin routes ======================== \\
}
