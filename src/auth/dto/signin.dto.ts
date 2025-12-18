import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {  IsString, ValidateIf } from "class-validator";

export class SignInDto{
    @ApiPropertyOptional({
        description:"Email of the user. Required if phone is not provided.",
        example:"user@example.com"
    })
    @IsString()
    @ValidateIf(o=>!o.phone)// validate email only if phone is missing
    email?:string;

    @ApiPropertyOptional({
        description:"Phone of the user. Required if email is not provided.",
        examples:["+963 911111111","0911111111","911111111"]
    })
    @IsString()
    @ValidateIf(o=>!o.email)// validate phone only if email is missing
    phone?:string;

    @ApiProperty()
    @IsString()
    password:string;
}