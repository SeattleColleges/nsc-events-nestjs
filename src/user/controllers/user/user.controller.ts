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
} from '@nestjs/common';
import { UserService } from '../../services/user/user.service';
import { Role } from '../../schemas/user.model';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

// ================== Admin routes =============================== \\
// TODO: Add AuthGuard to all admin routes and check for admin roles
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ----------------- Add User ------------------------------- \\
  @Post('new')
  // @UseGuards(AuthGuard())
  async adminAddUser(@Body() createUserDto: CreateUserDto, @Req() req: any) {
    const generatedId = await this.userService.newUser(createUserDto);
    return { id: generatedId };
  }

  // ----------------- Get Users ----------------------------- \\
  @Get('')
  // @UseGuards(AuthGuard())
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  // ----------------- Get User ------------------------------ \\
  @Get(':id')
  // @UseGuards(AuthGuard())
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  // ----------------- Get User by Email --------------------- \\
  @Get('email/:email')
  // @UseGuards(AuthGuard())
  async getUserByEmail(@Param('email') email: string) {
    return await this.userService.getUserByEmail(email);
  }

  // ----------------- Update User --------------------------- \\
  @Patch('update/:id')
  // @UseGuards(AuthGuard())
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
  // @UseGuards(AuthGuard())
  async adminDeleteUser(@Param('id') id: string, @Req() req: any) {
    await this.userService.removeUser(id);
  }

  // ================== End Admin routes ======================== \\
}
