import { ApiProperty } from '@nestjs/swagger';
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

export class EmployeeEntity {
  @ApiProperty({
    description: 'Unique identifier (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({ enum: AttritionType, example: AttritionType.NO })
  attrition: AttritionType;

  @ApiProperty({ example: 34, description: 'Age of the employee' })
  age: number;

  @ApiProperty({ example: 'Male' })
  gender: string;

  @ApiProperty({ enum: MaritalStatusType, example: MaritalStatusType.MARRIED })
  maritalStatus: MaritalStatusType;

  @ApiProperty({ example: 5, description: 'Distance from home in km' })
  distanceFromHome: number;

  @ApiProperty({ example: 5000, description: 'Monthly income' })
  monthlyIncome: number;

  @ApiProperty({ example: 12, description: 'Percent salary hike' })
  percentSalaryHike: number;

  @ApiProperty({ example: 2, description: 'Job level (1-5)' })
  jobLevel: number;

  @ApiProperty({ enum: JobRoleType, example: JobRoleType.SALES_EXECUTIVE })
  jobRole: JobRoleType;

  @ApiProperty({ enum: BusinessTravelType, example: BusinessTravelType.TRAVEL_RARELY })
  businessTravel: BusinessTravelType;

  @ApiProperty({ enum: DepartmentType, example: DepartmentType.SALES })
  department: DepartmentType;

  @ApiProperty({ enum: EducationLevel, example: EducationLevel.BACHELOR })
  education: EducationLevel;

  @ApiProperty({ enum: EducationFieldType, example: EducationFieldType.LIFE_SCIENCES })
  educationField: EducationFieldType;

  @ApiProperty({ example: 3, description: 'Number of companies worked at previously' })
  numCompaniesWorked: number;

  @ApiProperty({ example: 10, description: 'Total working years' })
  totalWorkingYears: number;

  @ApiProperty({ example: 2, description: 'Training times last year' })
  trainingTimesLastYear: number;

  @ApiProperty({ example: 40, description: 'Training hours last year' })
  trainingHoursLastYear: number;

  @ApiProperty({ example: 20, description: 'Training hours last 6 months' })
  trainingHoursLast6Months: number;

  @ApiProperty({ example: 0, description: 'Training gap score' })
  trainingGapScore: number;

  @ApiProperty({ example: 5, description: 'Years at current company' })
  yearsAtCompany: number;

  @ApiProperty({ example: 2, description: 'Years in current role' })
  yearsInCurrentRole: number;

  @ApiProperty({ example: 1, description: 'Years since last promotion' })
  yearsSinceLastPromotion: number;

  @ApiProperty({ example: 2, description: 'Years with current manager' })
  yearsWithCurrManager: number;

  // --- Ratings ---

  @ApiProperty({ enum: SatisfactionRating, example: SatisfactionRating.HIGH })
  environmentSatisfaction: SatisfactionRating;

  @ApiProperty({ enum: SatisfactionRating, example: SatisfactionRating.VERY_HIGH })
  jobInvolvement: SatisfactionRating;

  @ApiProperty({ enum: SatisfactionRating, example: SatisfactionRating.MEDIUM })
  jobSatisfaction: SatisfactionRating;

  @ApiProperty({ enum: PerformanceRating, example: PerformanceRating.EXCELLENT })
  performanceRating: PerformanceRating;

  @ApiProperty({ enum: SatisfactionRating, example: SatisfactionRating.HIGH })
  relationshipSatisfaction: SatisfactionRating;

  @ApiProperty({ enum: SatisfactionRating, example: SatisfactionRating.HIGH })
  workLifeBalance: SatisfactionRating;

  @ApiProperty({ enum: OvertimeType, example: OvertimeType.NO })
  overTime: OvertimeType;

  // --- Attendance & Metrics ---

  @ApiProperty({ example: 1 })
  absenceDaysLastMonth: number;

  @ApiProperty({ example: 2 })
  absenceDaysLast3Months: number;

  @ApiProperty({ example: 0.05, type: Number })
  absenceRatio: number;

  @ApiProperty({ example: 0 })
  lateArrivalsLastMonth: number;

  @ApiProperty({ example: 5.5, type: Number })
  overtimeHoursLastMonth: number;

  @ApiProperty({ example: 65, description: 'Workload pressure index' })
  workloadPressureIndex: number;

  @ApiProperty({ example: 88, description: 'Engagement score' })
  engagementScore: number;

  @ApiProperty({ example: 90, description: 'Manager feedback score' })
  managerFeedbackScore: number;

  @ApiProperty({ example: 0.95, type: Number })
  roleStabilityRatio: number;

  @ApiProperty({ enum: AttritionRiskClass, example: AttritionRiskClass.LOW })
  attritionRiskClass: AttritionRiskClass;
}