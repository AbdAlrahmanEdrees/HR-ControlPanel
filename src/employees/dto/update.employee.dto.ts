import { ApiProperty } from "@nestjs/swagger";
import { BaseEmployeeDto } from "./base.employee.dto";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateEmployeeDto extends BaseEmployeeDto {
    @ApiProperty({
        example: '1326f07e-d592-4d83-8d6a-bfef0ab01bdd',
        description: "employee's id",
    })
    @IsString()
    @IsNotEmpty()
    id: string;
}