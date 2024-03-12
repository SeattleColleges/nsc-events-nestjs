import {IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    readonly currentPassword: string;

    @IsNotEmpty()
    @IsString()
    readonly newPassword: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly newPasswordConfirm: string;
}