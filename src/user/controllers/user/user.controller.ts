/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../../services/user/user.service';
import { UserDocument } from '../../schemas/user.model';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { Roles } from '../../../auth/roles.decorator';
import { RoleGuard } from '../../../auth/role.guard';
import { Request } from 'express';

// ================== User admin routes ======================== \\

@Controller('users')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UserService,
  ) {}

  // ----------------- Get Users ----------------------------- \\
  // @Roles('admin')
  // @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get('')
  async getAllUsers() {
    const users = await this.userService.searchUsers({}).exec();

    return users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      pronouns: user.pronouns,
      email: user.email,
      role: user.role,
    }));
  }

  // @Roles('admin')
  // @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get('search')
  async searchUsers(@Req() req: Request) {
    // Destructure query parameters with defaults
    const { firstName = '', lastName = '', email = '', page, sort } = req.query;
    console.log('Search Users:', req.query);

    // Parse page and sort
    const currentPage = parseInt(page as string) || 1;
    const sortOrder = sort === 'asc' ? 1 : -1;

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

    // Combine conditions with AND operator
    const options = queryConditions.length > 0 ? { $and: queryConditions } : {};

    try {
      // Apply filters and sorting
      const usersQuery = this.userService
        .searchUsers(options)
        .sort({ role: sortOrder });

      // Pagination
      const limit = 9;
      const skip = (currentPage - 1) * limit;

      const data = await usersQuery.skip(skip).limit(limit).exec();

      // Total user count for the given query
      const total = await this.userService.countUsers(options);

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

  // ----------------- Get User ------------------------------ \\
  @Get('find/:id')
  async getUserById(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  // ----------------- Get User by Email --------------------- \\
  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return await this.userService.getUserByEmail(email);
  }

  // ----------------- Update User --------------------------- \\
  @Patch('update/:id')
  async updateUser(@Param('id') id: string, @Body() userDto: UpdateUserDto) {
    return await this.userService.updateUser(id, userDto as UserDocument);
  }

  // ----------------- Delete User --------------------------- //
  @Delete('remove/:id')
  async adminDeleteUser(@Param('id') id: string) {
    await this.userService.removeUser(id);
  }

  // ================== End Admin routes ======================== \\
}
