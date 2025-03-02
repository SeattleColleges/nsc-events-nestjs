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
  
  @Get('')
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  
  @Get('search')
  async searchUsers(@Req() req: Request) {
    // Destructure query parameters with defaults
    const {
      firstName = '',
      lastName = '',
      email = '',
      role = '',
      page,
    } = req.query as {
      firstName?: string;
      lastName?: string;
      email?: string;
      role?: string;
      page?: number;
    };

    console.log('Search Users Request Received:', req.query);

    const filters: {
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      page: number;
    } = { firstName, lastName, email, role, page };

    return this.userService.searchUsers(filters);
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