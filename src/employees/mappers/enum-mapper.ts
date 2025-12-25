import { BadRequestException } from '@nestjs/common';
import {
  AttritionType,
  BusinessTravelType,
  DepartmentType,
  EducationFieldType,
  EducationLevel,
  JobRoleType,
  OvertimeType,
  PerformanceRating,
  AttritionRiskClass,
} from 'generated/prisma/client';

/* =========================
   Generic helper
========================= */
export function mapEnumValue<T>(
  input: string | undefined,
  mapper: Record<string, T>,
  fieldName: string,
): T | undefined {
  if (!input) return undefined;

  // We look up the value directly because the DTO (@IsEnum) 
  // guarantees the input string matches the standard Prisma Client values (Title Case).
  const value = mapper[input];

  if (!value) {
    const allowed = Object.keys(mapper).join(', ');
    throw new BadRequestException(`Invalid ${fieldName}: '${input}'. Allowed values are: ${allowed}`);
  }

  return value;
}

/* =========================
   ENUM MAPPERS
   
   IMPORTANT: 
   The Keys (Left) match the DTO Input (The Mapped Value, e.g. "Human Resources")
   The Values (Right) MUST be the Prisma Engine KEY (e.g. "HUMAN_RESOURCES")
   
   We cast them 'as EnumType' so TypeScript is happy, but at runtime, 
   we are passing the strict Key string to the engine.
========================= */

export const AttritionTypeMap: Record<string, AttritionType> = {
  'Yes': 'YES' as AttritionType,
  'No': 'NO' as AttritionType,
};

export const OvertimeTypeMap: Record<string, OvertimeType> = {
  'Yes': 'YES' as OvertimeType,
  'No': 'NO' as OvertimeType,
};

export const BusinessTravelTypeMap: Record<string, BusinessTravelType> = {
  'Non-Travel': 'NON_TRAVEL' as BusinessTravelType,
  'Travel_Rarely': 'TRAVEL_RARELY' as BusinessTravelType,
  'Travel_Frequently': 'TRAVEL_FREQUENTLY' as BusinessTravelType,
};

export const DepartmentTypeMap: Record<string, DepartmentType> = {
  'Sales': 'SALES' as DepartmentType,
  'Human Resources': 'HUMAN_RESOURCES' as DepartmentType,
  'Research & Development': 'RESEARCH_DEVELOPMENT' as DepartmentType,
};

export const EducationLevelMap: Record<string, EducationLevel> = {
  'Below College': 'BELOW_COLLEGE' as EducationLevel,
  'College': 'COLLEGE' as EducationLevel,
  'Bachelor': 'BACHELOR' as EducationLevel,
  'Master': 'MASTER' as EducationLevel,
  'Doctor': 'DOCTOR' as EducationLevel,
};

export const EducationFieldTypeMap: Record<string, EducationFieldType> = {
  'Life Sciences': 'LIFE_SCIENCES' as EducationFieldType,
  'Medical': 'MEDICAL' as EducationFieldType,
  'Marketing': 'MARKETING' as EducationFieldType,
  'Technical Degree': 'TECHNICAL_DEGREE' as EducationFieldType,
  'Human Resources': 'HUMAN_RESOURCES' as EducationFieldType,
  'Other': 'OTHER' as EducationFieldType,
};

export const JobRoleTypeMap: Record<string, JobRoleType> = {
  'Sales Executive': 'SALES_EXECUTIVE' as JobRoleType,
  'Manager': 'MANAGER' as JobRoleType,
  'Research Scientist': 'RESEARCH_SCIENTIST' as JobRoleType,
  'Laboratory Technician': 'LABORATORY_TECHNICIAN' as JobRoleType,
  'Manufacturing Director': 'MANUFACTURING_DIRECTOR' as JobRoleType,
  'Healthcare Representative': 'HEALTHCARE_REPRESENTATIVE' as JobRoleType,
  'Sales Representative': 'SALES_REPRESENTATIVE' as JobRoleType,
  'Research Director': 'RESEARCH_DIRECTOR' as JobRoleType,
  'Human Resources': 'HUMAN_RESOURCES' as JobRoleType,
};

export const PerformanceRatingMap: Record<string, PerformanceRating> = {
  'Low': 'LOW' as PerformanceRating,
  'Good': 'GOOD' as PerformanceRating,
  'Excellent': 'EXCELLENT' as PerformanceRating,
  'Outstanding': 'OUTSTANDING' as PerformanceRating,
};

export const AttritionRiskClassMap: Record<string, AttritionRiskClass> = {
  'Low': 'LOW' as AttritionRiskClass,
  'Medium': 'MEDIUM' as AttritionRiskClass,
  'High': 'HIGH' as AttritionRiskClass,
};