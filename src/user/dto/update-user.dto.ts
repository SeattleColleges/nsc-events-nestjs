import { IsEmpty, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '../schemas/user.model';

export class UpdateUserDto { 
    
  @IsOptional()
  @IsString()
  readonly name: string;
  
  @IsOptional()
  @IsEmpty({ message: 'Cannot update email here' })
  readonly email: string;
  
  @IsOptional()
  @IsEmpty({ message: 'Cannot update password here' })
  readonly password: string;
  
  @IsOptional()
  @IsEnum(Role)
  readonly role: Role;

}
