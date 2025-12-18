import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from 'generated/prisma/enums';

export class CreateUserDto {
    @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'john@example.com', description: 'Unique email address' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'SecureP@ss123', description: 'Password (min 6 characters)', minLength: 6 })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: '+1234567890', description: 'Phone number', required: false })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty({ enum: UserRole, example: 'ADMIN', description: 'User role', required: false })
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;
}