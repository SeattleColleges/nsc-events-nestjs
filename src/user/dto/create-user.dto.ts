import { Role } from '../../auth/schemas/userAuthSchema';
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
  @MinLength(2, { message: 'Must be equal to or longer than 2 letters' })
  name: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
