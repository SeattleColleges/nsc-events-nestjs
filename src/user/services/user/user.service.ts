/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { Role, UserDocument } from '../../schemas/user.model';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {
    // User defined in user.module.ts
  }
  async addUser(name: string, email: string, role: string): Promise<string> {
    const newUser = new this.userModel({ name, email, role }); // doc will be expanded to name: name etc.
    const result = await newUser.save();
    // return mongodb generated id note the underscore.
    return result._id;
  }

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
  async updateUser(id: string, name: string, email: string, role: Role) {
    const updatedUser = await this.userModel.findById(id).exec();
    if (name) {
      console.log('name ', name);
      updatedUser.name = name;
    }
    if (email) {
      console.log('email ', email);
      updatedUser.email = email;
    }
    if (role) {
      console.log('role ', role);
      updatedUser.role = role;
    }
    const updated = await updatedUser.save();
    console.log(updated);
    return updated;
  }

  // ----------------- Admin routes -------------------------------- //

  // ----------------- Admin add user ----------------- //
  async adminAddUser(
    name: string,
    email: string,
    password: string,
    role: Role,
  ): Promise<string> {
    // Password is saved as a hash so it is not stored in plain text
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
      if (error.code === 11000) {
        // MongoDB duplicate key error
        throw new Error('User with this email already exists');
      }
      throw error('error creating a user');
    }
  }

  // ----------------- End Admin Routes ------------------------ //
}
