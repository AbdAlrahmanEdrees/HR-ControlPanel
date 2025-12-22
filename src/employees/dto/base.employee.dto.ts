import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

import {
  AttritionType,
  MaritalStatusType,
  JobRoleType,
  BusinessTravelType,
  DepartmentType,
  EducationLevel,
  EducationFieldType,
  SatisfactionRating,
  PerformanceRating,
  OvertimeType,
  AttritionRiskClass,
} from 'generated/prisma/enums';

export class BaseEmployeeDto {
  @ApiProperty({ enum: AttritionType, example: AttritionType.YES })
  @IsEnum(AttritionType)
  @IsNotEmpty()
  attrition: AttritionType;

  @ApiProperty({ example: 35 })
  @IsInt()
  @IsNotEmpty()
  age: number;

  @ApiProperty({ example: 'Male' })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({ enum: MaritalStatusType })
  @IsEnum(MaritalStatusType)
  @IsNotEmpty()
  maritalStatus: MaritalStatusType;

  @ApiProperty({ example: 12 })
  @IsInt()
  @IsNotEmpty()
  distanceFromHome: number;

  @ApiProperty({ example: 4500 })
  @IsInt()
  @IsNotEmpty()
  monthlyIncome: number;

  @ApiProperty({ example: 15 })
  @IsInt()
  @IsNotEmpty()
  percentSalaryHike: number;

  @ApiProperty({ example: 3, description: 'Job level from 1 to 5' })
  @IsInt()
  @IsNotEmpty()
  jobLevel: number;

  @ApiProperty({ enum: JobRoleType })
  @IsEnum(JobRoleType)
  @IsNotEmpty()
  jobRole: JobRoleType;

  @ApiProperty({ enum: BusinessTravelType })
  @IsEnum(BusinessTravelType)
  @IsNotEmpty()
  businessTravel: BusinessTravelType;

  @ApiProperty({ enum: DepartmentType })
  @IsEnum(DepartmentType)
  @IsNotEmpty()
  department: DepartmentType;

  @ApiProperty({ enum: EducationLevel })
  @IsEnum(EducationLevel)
  @IsNotEmpty()
  education: EducationLevel;

  @ApiProperty({ enum: EducationFieldType })
  @IsEnum(EducationFieldType)
  @IsNotEmpty()
  educationField: EducationFieldType;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsNotEmpty()
  numCompaniesWorked: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  @IsNotEmpty()
  totalWorkingYears: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  @IsNotEmpty()
  trainingTimesLastYear: number;

  @ApiProperty({ example: 40 })
  @IsInt()
  @IsNotEmpty()
  trainingHoursLastYear: number;

  @ApiProperty({ example: 20 })
  @IsInt()
  @IsNotEmpty()
  trainingHoursLast6Months: number;

  @ApiProperty({ example: 75 })
  @IsInt()
  @IsNotEmpty()
  trainingGapScore: number;

  @ApiProperty({ example: 5 })
  @IsInt()
  @IsNotEmpty()
  yearsAtCompany: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  @IsNotEmpty()
  yearsInCurrentRole: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsNotEmpty()
  yearsSinceLastPromotion: number;

  @ApiProperty({ example: 4 })
  @IsInt()
  @IsNotEmpty()
  yearsWithCurrManager: number;

  @ApiProperty({ enum: SatisfactionRating })
  @IsEnum(SatisfactionRating)
  @IsNotEmpty()
  environmentSatisfaction: SatisfactionRating;

  @ApiProperty({ enum: SatisfactionRating })
  @IsEnum(SatisfactionRating)
  @IsNotEmpty()
  jobInvolvement: SatisfactionRating;

  @ApiProperty({ enum: SatisfactionRating })
  @IsEnum(SatisfactionRating)
  @IsNotEmpty()
  jobSatisfaction: SatisfactionRating;

  @ApiProperty({ enum: PerformanceRating })
  @IsEnum(PerformanceRating)
  @IsNotEmpty()
  performanceRating: PerformanceRating;

  @ApiProperty({ enum: SatisfactionRating })
  @IsEnum(SatisfactionRating)
  @IsNotEmpty()
  relationshipSatisfaction: SatisfactionRating;

  @ApiProperty({ enum: SatisfactionRating })
  @IsEnum(SatisfactionRating)
  @IsNotEmpty()
  workLifeBalance: SatisfactionRating;

  @ApiProperty({ enum: OvertimeType })
  @IsEnum(OvertimeType)
  @IsNotEmpty()
  overTime: OvertimeType;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  absenceDaysLastMonth: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  @IsNotEmpty()
  absenceDaysLast3Months: number;

  @ApiProperty({ example: 0.12 })
  @IsNumber()
  @IsNotEmpty()
  absenceRatio: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsNotEmpty()
  lateArrivalsLastMonth: number;

  @ApiProperty({ example: 8.5 })
  @IsNumber()
  @IsNotEmpty()
  overtimeHoursLastMonth: number;

  @ApiProperty({ example: 70 })
  @IsInt()
  @IsNotEmpty()
  workloadPressureIndex: number;

  @ApiProperty({ example: 82 })
  @IsInt()
  @IsNotEmpty()
  engagementScore: number;

  @ApiProperty({ example: 88 })
  @IsInt()
  @IsNotEmpty()
  managerFeedbackScore: number;

  @ApiProperty({ example: 0.85 })
  @IsNumber()
  @IsNotEmpty()
  roleStabilityRatio: number;

  @ApiProperty({ enum: AttritionRiskClass })
  @IsEnum(AttritionRiskClass)
  @IsNotEmpty()
  attritionRiskClass: AttritionRiskClass;
}
