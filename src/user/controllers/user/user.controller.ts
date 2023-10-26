/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../../services/user/user.service';
import { Role } from '../../schemas/user.model';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

// ================== User admin routes ======================== \\
@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ----------------- Add User ------------------------------- \\
  @Post('new')
  async adminAddUser(@Body() createUserDto: CreateUserDto, @Req() req: any) {
    const generatedId = await this.userService.newUser(createUserDto);
    return { id: generatedId };
  }

  // ----------------- Get Users ----------------------------- \\
  @Get('')
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  // ----------------- Get User ------------------------------ \\
  @Get('find/:id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  // ----------------- Get User by Email --------------------- \\
  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return await this.userService.getUserByEmail(email);
  }

  // ----------------- Update User --------------------------- \\
  @Patch('update/:id')
  async updateUser(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('role') role: Role,
  ) {
    await this.userService.updateUser(id, name, email, role);
  }

  // ----------------- Delete User --------------------------- //
  @Delete('remove/:id')
  async adminDeleteUser(@Param('id') id: string, @Req() req: any) {
    await this.userService.removeUser(id);
  }

  // ================== End Admin routes ======================== \\
}
