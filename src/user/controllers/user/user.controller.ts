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
import { UserDocument, UserSearchFilters } from '../../schemas/user.model';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { Roles } from '../../../auth/roles.decorator';
import { RoleGuard } from '../../../auth/role.guard';
import { Request } from 'express';
import { UserRole } from '../../../enums/roles.enum';

// ================== User admin routes ======================== \\
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UserService,
  ) {}

  // ----------------- Get Users ----------------------------- \\
  @Roles('admin')
  @UseGuards(RoleGuard)
  @Get('')
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  // -------------------- Search Users ----------------------- \\
  @Roles('admin')
  @UseGuards(RoleGuard)
  @Get('search')
  async searchUsers(@Req() req: Request) {
    console.log('Search Users Request Received:', req.query);
    const filters: UserSearchFilters = req.query;
    
    // Validate the role
    if (filters.role && !Object.values(UserRole).includes(filters.role as UserRole)) {
      filters.role = ''; // Defaults to fetching all users
    }
    
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
