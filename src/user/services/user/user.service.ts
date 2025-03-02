/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Req,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDocument } from '../../schemas/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  // ----------------- Get all users ----------------- \\
  async getAllUsers(): Promise<any> {
    //fix: Use serialization to mask password, so we don't have to transform the data
    const users: UserDocument[] = await this.userModel.find().exec();
    return users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      pronouns: user.pronouns,
      email: user.email,
      role: user.role,
    }));
  }

  async searchUsers(filters: {
    firstName: string;
    lastName: string;
    email: string;
    page: number;
    role: string;
  }): Promise<{
    data: {
      id: string;
      firstName: string;
      lastName: string;
      pronouns: string;
      email: string;
      role: string;
    }[];
    page: number;
    total: number;
    pages: number;
  }> {
    // Destructure query parameters with defaults
    const { firstName, lastName, email, page, role } = filters;

    // Parse page and sort
    const currentPage = Number(page) || 1;

    // Build query conditions
    const queryConditions: any[] = [];
    if (firstName)
      queryConditions.push({
        firstName: { $regex: firstName.toString(), $options: 'i' },
      });
    if (lastName)
      queryConditions.push({
        lastName: { $regex: lastName.toString(), $options: 'i' },
      });
    if (email)
      queryConditions.push({
        email: { $regex: email.toString(), $options: 'i' },
      });

    // Add role filtering (No regex needed, since role is a fixed string)
    if (role)
      queryConditions.push({
        role: role.toString(),
      });

    // Combine conditions with AND operator
    const options = queryConditions.length > 0 ? { $and: queryConditions } : {};

    try {
      // Apply filters and sorting
      const usersQuery = this.userModel
        .find(options)
        .sort({ lastName: 'asc' }); // Sort by last name in ascending order

      // Pagination
      const limit = 9;
      const skip = (currentPage - 1) * limit;

      const data = await usersQuery.skip(skip).limit(limit).exec();

      // Total user count for the given query
      const total = await this.userModel.count(options);

      // Format response data
      const serializedData = data.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        pronouns: user.pronouns,
        email: user.email,
        role: user.role,
      }));

      return {
        data: serializedData,
        page: currentPage,
        total,
        pages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Error searching users:', error);
      throw new HttpException(
        'Error retrieving users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
      firstName: user.firstName,
      lastName: user.lastName,
      pronouns: user.pronouns,
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
      firstName: user.firstName,
      lastName: user.lastName,
      pronouns: user.pronouns,
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
      firstName: user.firstName,
      lastName: user.lastName,
      pronouns: user.pronouns,
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
