/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDocument } from '../../schemas/user.model';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

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
      user = await this.userModel.findOne({ email: email }).exec();
      console.log(user);
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

  // ----------------- Update user ----------------- \\
  async updateUser(id: string, user: UserDocument) {
    // we may want to check if id is a valid id
    // if you remove/add a character, it returns a 500 error
    if (user === null) {
      throw new BadRequestException(`Updated User not supplied`);
    }
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, user, {
        new: true,
        runValidators: true,
      })
      .exec();
    if (!updatedUser) {
      throw new HttpException(
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    } as UserDocument;
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
