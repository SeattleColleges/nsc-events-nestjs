import { Role } from '../../auth/schemas/user.schema';
import {
  IsAlpha,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'Please enter a valid email.' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  @MinLength(2, { message: 'Name must be longer than 2 letters.' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must contain 8 characters or more.' })
  password: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
