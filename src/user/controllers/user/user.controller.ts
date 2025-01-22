/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
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
    let options = {};
    if (req.query.s) {
      options = {
        $or: [
          { firstName: { $regex: req.query.s.toString(), $options: 'i' } },
          { lastName: { $regex: req.query.s.toString(), $options: 'i' } },
          { email: { $regex: req.query.s.toString(), $options: 'i' } },
          { role: { $regex: req.query.s.toString(), $options: 'i' } },
        ],
      };
    }

    const users = this.userService.searchUsers(options);

    if (req.query.sort) {
      users.sort({
        lastName: req.query.sort.toString() as 'asc' | 'desc',
      });
    }

    const page = parseInt(req.query.page as any) || 1;
    const limit = 9;

    const data = await users
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const total = await this.userService.countUsers(options);
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
      page,
      total,
      pages: Math.ceil(total / limit),
    };
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
