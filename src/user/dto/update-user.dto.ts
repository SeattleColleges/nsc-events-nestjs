import { IsEmpty, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '../schemas/user.model';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly firstName: string;

  @IsOptional()
  @IsString()
  readonly lastName: string;

  @IsOptional()
  @IsString()
  readonly pronouns: string;

  @IsOptional()
  @IsEmpty({ message: 'Cannot update email here' })
  readonly email: string;

  @IsOptional()
  @IsEmpty({ message: 'Cannot update password here' })
  readonly password: string;

  @IsOptional()
  @IsEnum(Role)
  readonly role: Role;

  // Google OAuth
  @IsOptional()
  @IsString()
  readonly googleId: string;

  @IsOptional()
  @IsString()
  readonly googleEmail: string;

  @IsOptional()
  @IsString()
  readonly googleAccessToken: string;

  @IsOptional()
  @IsString()
  readonly googleRefreshToken: string;

  @IsOptional()
  @IsString()
  readonly googleTokenExpiry: string;
}
