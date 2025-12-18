import fs from 'fs';
import { randomUUID } from 'crypto';
import {
  PrismaClient,
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
} from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config();


    //###########################################################
    //###### Aiven Postgresql  (requires ssl encryption) ########
    //###########################################################
    const adapter = new PrismaPg({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: Number(process.env.DB_PORT),
        ssl: {
            rejectUnauthorized: false,
        },
        // connectionLimit:5
    });

const prisma = new PrismaClient({
  adapter: adapter
});

// --- Mapping Helpers ---

// FIX: Force return of keys (e.g., 'YES') instead of values (e.g., 'Yes')

const mapAttrition = (val: string): AttritionType => 
  val === 'Yes' ? 'YES' as AttritionType : 'NO' as AttritionType;

const mapOverTime = (val: string): OvertimeType => 
  val === 'Yes' ? 'YES' as OvertimeType : 'NO' as OvertimeType;

const mapBusinessTravel = (val: string): BusinessTravelType => {
  switch (val) {
    case 'Travel_Frequently': return 'TRAVEL_FREQUENTLY' as BusinessTravelType;
    case 'Travel_Rarely': return 'TRAVEL_RARELY' as BusinessTravelType;
    default: return 'NON_TRAVEL' as BusinessTravelType;
  }
};

const mapDepartment = (val: string): DepartmentType => {
  switch (val) {
    case 'Sales': return 'SALES' as DepartmentType;
    case 'Human Resources': return 'HUMAN_RESOURCES' as DepartmentType;
    default: return 'RESEARCH_DEVELOPMENT' as DepartmentType;
  }
};

const mapEducationField = (val: string): EducationFieldType => {
  switch (val) {
    case 'Life Sciences': return 'LIFE_SCIENCES' as EducationFieldType;
    case 'Medical': return 'MEDICAL' as EducationFieldType;
    case 'Marketing': return 'MARKETING' as EducationFieldType;
    case 'Technical Degree': return 'TECHNICAL_DEGREE' as EducationFieldType;
    case 'Human Resources': return 'HUMAN_RESOURCES' as EducationFieldType;
    default: return 'OTHER' as EducationFieldType;
  }
};

const mapJobRole = (val: string): JobRoleType => {
  const map: Record<string, JobRoleType> = {
    'Sales Executive': 'SALES_EXECUTIVE' as JobRoleType,
    'Research Scientist': 'RESEARCH_SCIENTIST' as JobRoleType,
    'Laboratory Technician': 'LABORATORY_TECHNICIAN' as JobRoleType,
    'Manufacturing Director': 'MANUFACTURING_DIRECTOR' as JobRoleType,
    'Healthcare Representative': 'HEALTHCARE_REPRESENTATIVE' as JobRoleType,
    'Manager': 'MANAGER' as JobRoleType,
    'Sales Representative': 'SALES_REPRESENTATIVE' as JobRoleType,
    'Research Director': 'RESEARCH_DIRECTOR' as JobRoleType,
    'Human Resources': 'HUMAN_RESOURCES' as JobRoleType,
  };
  return map[val] || 'SALES_EXECUTIVE' as JobRoleType;
};

const mapMaritalStatus = (val: string): MaritalStatusType => {
  switch (val) {
    case 'Married': return 'MARRIED' as MaritalStatusType;
    case 'Divorced': return 'DIVORCED' as MaritalStatusType;
    default: return 'SINGLE' as MaritalStatusType;
  }
};

const mapRiskClass = (val: string): AttritionRiskClass => {
  switch (val) {
    case 'High': return 'HIGH' as AttritionRiskClass;
    case 'Medium': return 'MEDIUM' as AttritionRiskClass;
    default: return 'LOW' as AttritionRiskClass;
  }
};

const mapEducation = (val: string): EducationLevel => {
  const v = parseInt(val);
  if (v === 1) return 'BELOW_COLLEGE' as EducationLevel;
  if (v === 2) return 'COLLEGE' as EducationLevel;
  if (v === 3) return 'BACHELOR' as EducationLevel;
  if (v === 4) return 'MASTER' as EducationLevel;
  if (v === 5) return 'DOCTOR' as EducationLevel;
  return 'BELOW_COLLEGE' as EducationLevel;
};

const mapSatisfaction = (val: string): SatisfactionRating => {
  const v = parseInt(val);
  if (v === 1) return 'LOW' as SatisfactionRating;
  if (v === 2) return 'MEDIUM' as SatisfactionRating;
  if (v === 3) return 'HIGH' as SatisfactionRating;
  if (v === 4) return 'VERY_HIGH' as SatisfactionRating;
  return 'MEDIUM' as SatisfactionRating;
};

const mapPerformance = (val: string): PerformanceRating => {
  const v = parseInt(val);
  if (v === 1) return 'LOW' as PerformanceRating;
  if (v === 2) return 'GOOD' as PerformanceRating;
  if (v === 3) return 'EXCELLENT' as PerformanceRating;
  if (v === 4) return 'OUTSTANDING' as PerformanceRating;
  return 'EXCELLENT' as PerformanceRating;
};

async function main() {
  const fileContent = fs.readFileSync("scripts\\Transformed_HR_Analytics_Dataset.csv", 'utf-8');
  
  const lines = fileContent.split('\n').filter(line => line.trim() !== '');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const employeesToCreate = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length < headers.length) continue;

    const row: Record<string, string> = {};
    headers.forEach((h, index) => {
      row[h] = values[index]?.trim();
    });

    // Create the employee object matching your Prisma Schema
    employeesToCreate.push({
      id: randomUUID(), // Required: createMany skips Prisma's @default(uuid())
      age: parseInt(row['age']),
      attrition: mapAttrition(row['attrition']),
      businessTravel: mapBusinessTravel(row['business_travel']),
      department: mapDepartment(row['department']),
      distanceFromHome: parseInt(row['distance_from_home']),
      education: mapEducation(row['education']),
      educationField: mapEducationField(row['education_field']),
      environmentSatisfaction: mapSatisfaction(row['environment_satisfaction']),
      gender: row['gender'],
      jobInvolvement: mapSatisfaction(row['job_involvement']),
      jobLevel: parseInt(row['job_level']),
      jobRole: mapJobRole(row['job_role']),
      jobSatisfaction: mapSatisfaction(row['job_satisfaction']),
      maritalStatus: mapMaritalStatus(row['marital_status']),
      monthlyIncome: parseInt(row['monthly_income']),
      numCompaniesWorked: parseInt(row['num_companies_worked']),
      overTime: mapOverTime(row['over_time']),
      percentSalaryHike: parseInt(row['percent_salary_hike']),
      performanceRating: mapPerformance(row['performance_rating']),
      relationshipSatisfaction: mapSatisfaction(row['relationship_satisfaction']),
      totalWorkingYears: parseInt(row['total_working_years']),
      trainingTimesLastYear: parseInt(row['training_times_last_year']),
      workLifeBalance: mapSatisfaction(row['work_life_balance']),
      yearsAtCompany: parseInt(row['years_at_company']),
      yearsInCurrentRole: parseInt(row['years_in_current_role']),
      yearsSinceLastPromotion: parseInt(row['years_since_last_promotion']),
      yearsWithCurrManager: parseInt(row['years_with_curr_manager']),
      absenceDaysLastMonth: parseInt(row['absence_days_last_month']),
      absenceDaysLast3Months: parseInt(row['absence_days_last_3_months']),
      absenceRatio: parseFloat(row['absence_ratio']),
      lateArrivalsLastMonth: parseInt(row['late_arrivals_last_month']),
      overtimeHoursLastMonth: parseFloat(row['overtime_hours_last_month']),
      engagementScore: parseInt(row['engagement_score']),
      managerFeedbackScore: parseInt(row['manager_feedback_score']),
      trainingHoursLastYear: parseInt(row['training_hours_last_year']),
      trainingHoursLast6Months: parseInt(row['training_hours_last_6_months']),
      trainingGapScore: parseInt(row['training_gap_score']),
      roleStabilityRatio: parseFloat(row['role_stability_ratio']),
      workloadPressureIndex: parseInt(row['workload_pressure_index']),
      attritionRiskClass: mapRiskClass(row['attrition_risk_class']),
    });
  }

  console.log(`Inserting ${employeesToCreate.length} records...`);

  await prisma.employees.createMany({
    data: employeesToCreate,
    skipDuplicates: true, 
  });

  console.log('Done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


