import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsString } from "class-validator";

export class ResetPasswordDto {
    @IsString()
    @ApiProperty({description:"user's id, to put extra protection to the endpoint!",example:"lkjlsdf-asdlkl-lkjli...."})
    userId:string;

    @IsNumber()
    @ApiProperty({
        description: "the verification-code sent to email",
        example: 12345
    })
    code: number;

    @IsEmail()
    @ApiProperty({description:"valid email, we added it also to put extra protection",example:"aaa@example.com"})
    email: string;

    @IsString()
    @ApiProperty()
    newPassword: string;
}