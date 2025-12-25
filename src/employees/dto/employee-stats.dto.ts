import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Fields we allow grouping by
// Keys can be anything, but VALUES must match the exact Prisma Model column names
export enum GroupByField {
  DEPARTMENT = 'department',
  JOB_ROLE = 'jobRole',
  EDUCATION_FIELD = 'educationField',
  ATTRITION_RISK = 'attritionRiskClass', 
  // PERFORMANCE_RATING = 'performanceRating' // Uncomment if you want to group by rating
}

export class EmployeeStatsDto {
  @ApiProperty({ 
    enum: GroupByField, 
    description: 'The field to group data by (e.g. department)',
    example: GroupByField.DEPARTMENT
  })
  @IsEnum(GroupByField)
  @IsNotEmpty() // <--- Ensures the client sends this parameter
  groupBy: GroupByField;
}