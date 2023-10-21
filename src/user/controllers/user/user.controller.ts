import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { UserService } from '../../services/user/user.service';
import { Role } from '../../schemas/user.model';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('add')
  async addUser(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('role') role: string,
  ) {
    const generatedId = await this.userService.addUser(name, email, role);
    return { id: generatedId };
  }

  @Get('')
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return await this.userService.getUserByEmail(email);
  }
  @Patch('update/:id')
  async updateUser(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('role') role: Role,
  ) {
    await this.userService.updateUser(id, name, email, role);
  }

  // ----------------- Admin routes -------------------------------- //

  // ----------------- Admin Add User ------------------------------ //
  @Post('admin/add')
  // @UseGuards(AuthGuard())
  async adminAddUser(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('role') role: Role,
    @Req() req: any,
  ) {
    /* if (req.user.role === Role.admin) {
      const generatedId = await this.userService.addUser(name, email, role);
      return { id: generatedId };
    } else {
      throw new UnauthorizedException();
    } */
    const generatedId = await this.userService.adminAddUser(
      name,
      email,
      password,
      role,
    );
    return { id: generatedId };
  }

  // ----------------- Admin Delete User --------------------------- //
  @Delete('admin/delete/:id')
  // @UseGuards(AuthGuard())
  async adminDeleteUser(@Param('id') id: string, @Req() req: any) {
    /* if (req.user.role === Role.admin) {
        await this.userService.deleteUser(id);
      } else {
        throw new UnauthorizedException();
      } */
    await this.userService.adminDeleteUser(id);
  }

  // ----------------- End Admin routes ---------------------------- //
}
