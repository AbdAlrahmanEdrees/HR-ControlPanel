import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, isNumber, IsString, Length } from "class-validator";

export class VerifingDto{
    @ApiProperty({description:"user's id",example:"eo8179-exlholr-slklkjl..."})
    @IsString()
    userId:string;

    @ApiProperty({description:"4 digits integer",example:"0000"})
    @IsNumber()
    code:number;
}