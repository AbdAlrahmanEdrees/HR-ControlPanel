import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { EducationFieldType, Employees, Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UpdateEmployeeDto } from './dto/update.employee.dto';
import { CreateEmployeeDto } from './dto/create.employee.dto';
import { EmployeeQueryDto } from './dto/employee-query.dto';
import { EmployeeStatsDto } from './dto/employee-stats.dto';
import { AttritionRiskClassMap, AttritionTypeMap, BusinessTravelTypeMap, DepartmentTypeMap, EducationFieldTypeMap, EducationLevelMap, JobRoleTypeMap, mapEnumValue, OvertimeTypeMap, PerformanceRatingMap } from './mappers/enum-mapper';



// I discovered that the try-catch around prisma is not needed:
//         Prisma throws an exception (promise rejection)
// NestJS automatically catches it at the framework level
//         When try/catch is justified
// You should use try/catch only if you translate or enrich the error.
@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) { }


  async findAll(params: EmployeeQueryDto) {
    const {
      skip, take, sortBy, sortOrder,
      // Ranges
      minAge, maxAge, minJobLevel, maxJobLevel, minMonthlyIncome, maxMonthlyIncome,
      minPercentSalaryHike, maxPercentSalaryHike, minTotalWorkingYears, maxTotalWorkingYears,
      minNumCompaniesWorked, maxNumCompaniesWorked, minYearsAtCompany, maxYearsAtCompany,
      minYearsInCurrentRole, maxYearsInCurrentRole, minYearsSinceLastPromotion, maxYearsSinceLastPromotion,
      minYearsWithCurrManager, maxYearsWithCurrManager, minTrainingTimesLastYear, maxTrainingTimesLastYear,
      minTrainingHoursLastYear, maxTrainingHoursLastYear, minTrainingHoursLast6Months, maxTrainingHoursLast6Months,
      minTrainingGapScore, maxTrainingGapScore, minDistanceFromHome, maxDistanceFromHome,
      minAbsenceDaysLastMonth, maxAbsenceDaysLastMonth, minAbsenceDaysLast3Months, maxAbsenceDaysLast3Months,
      minAbsenceRatio, maxAbsenceRatio, minLateArrivalsLastMonth, maxLateArrivalsLastMonth,
      minOvertimeHoursLastMonth, maxOvertimeHoursLastMonth, minWorkloadPressureIndex, maxWorkloadPressureIndex,
      minEngagementScore, maxEngagementScore, minManagerFeedbackScore, maxManagerFeedbackScore,
      minRoleStabilityRatio, maxRoleStabilityRatio,
      // Exact filters (rest)
      ...exactFilters
    } = params;

    // Helper for numeric ranges
    const range = (min?: number, max?: number) => {
      if (min === undefined && max === undefined) return undefined;
      return { gte: min, lte: max };
    };

    // 1. Map String/Enum inputs to strict Prisma Client Enums
    // We cast to 'string' here because the DTO types them as Enums, but mapEnumValue takes a string key.
    const mappedFilters = {
      attrition: mapEnumValue(params.attrition as unknown as string, AttritionTypeMap, 'attrition'),
      businessTravel: mapEnumValue(params.businessTravel as unknown as string, BusinessTravelTypeMap, 'businessTravel'),
      department: mapEnumValue(params.department as unknown as string, DepartmentTypeMap, 'department'),
      education: mapEnumValue(params.education as unknown as string, EducationLevelMap, 'education'),
      // FIXED: Uses the dynamic mapper, which now correctly returns the 'HUMAN_RESOURCES' key
      educationField: mapEnumValue(params.educationField as unknown as string, EducationFieldTypeMap, 'educationField'),
      jobRole: mapEnumValue(params.jobRole as unknown as string, JobRoleTypeMap, 'jobRole'),
      overTime: mapEnumValue(params.overTime as unknown as string, OvertimeTypeMap, 'overTime'),
      performanceRating: mapEnumValue(params.performanceRating as unknown as string, PerformanceRatingMap, 'performanceRating'),
      attritionRiskClass: mapEnumValue(params.attritionRiskClass as unknown as string, AttritionRiskClassMap, 'attritionRiskClass'),

      // These fields are already standard types (string/float) or mapped by DTO
      gender: params.gender,
      maritalStatus: params.maritalStatus, // Mapped automatically if using strict DTO enum
      environmentSatisfaction: params.environmentSatisfaction,
      jobInvolvement: params.jobInvolvement,
      jobSatisfaction: params.jobSatisfaction,
      relationshipSatisfaction: params.relationshipSatisfaction,
      workLifeBalance: params.workLifeBalance,
    };

    // 2. Construct Numeric Ranges
    const numericFilters = {
      age: range(minAge, maxAge),
      jobLevel: range(minJobLevel, maxJobLevel),
      monthlyIncome: range(minMonthlyIncome, maxMonthlyIncome),
      percentSalaryHike: range(minPercentSalaryHike, maxPercentSalaryHike),
      totalWorkingYears: range(minTotalWorkingYears, maxTotalWorkingYears),
      numCompaniesWorked: range(minNumCompaniesWorked, maxNumCompaniesWorked),
      yearsAtCompany: range(minYearsAtCompany, maxYearsAtCompany),
      yearsInCurrentRole: range(minYearsInCurrentRole, maxYearsInCurrentRole),
      yearsSinceLastPromotion: range(minYearsSinceLastPromotion, maxYearsSinceLastPromotion),
      yearsWithCurrManager: range(minYearsWithCurrManager, maxYearsWithCurrManager),
      trainingTimesLastYear: range(minTrainingTimesLastYear, maxTrainingTimesLastYear),
      trainingHoursLastYear: range(minTrainingHoursLastYear, maxTrainingHoursLastYear),
      trainingHoursLast6Months: range(minTrainingHoursLast6Months, maxTrainingHoursLast6Months),
      trainingGapScore: range(minTrainingGapScore, maxTrainingGapScore),
      distanceFromHome: range(minDistanceFromHome, maxDistanceFromHome),
      absenceDaysLastMonth: range(minAbsenceDaysLastMonth, maxAbsenceDaysLastMonth),
      absenceDaysLast3Months: range(minAbsenceDaysLast3Months, maxAbsenceDaysLast3Months),
      absenceRatio: range(minAbsenceRatio, maxAbsenceRatio),
      lateArrivalsLastMonth: range(minLateArrivalsLastMonth, maxLateArrivalsLastMonth),
      overtimeHoursLastMonth: range(minOvertimeHoursLastMonth, maxOvertimeHoursLastMonth),
      workloadPressureIndex: range(minWorkloadPressureIndex, maxWorkloadPressureIndex),
      engagementScore: range(minEngagementScore, maxEngagementScore),
      managerFeedbackScore: range(minManagerFeedbackScore, maxManagerFeedbackScore),
      roleStabilityRatio: range(minRoleStabilityRatio, maxRoleStabilityRatio),
    };

    // 3. Merge all filters
    const where: Prisma.EmployeesWhereInput = {
      ...mappedFilters,
      ...numericFilters,
    };

    // 4. Remove undefined keys (Cleanup)
    Object.keys(where).forEach((key) => {
      if ((where as any)[key] === undefined) delete (where as any)[key];
    });

    // 5. Sorting logic
    const orderBy: Prisma.EmployeesOrderByWithRelationInput[] = [];
    if (sortBy) {
      orderBy.push({ [sortBy]: sortOrder } as Prisma.EmployeesOrderByWithRelationInput);
    }
    // Always add ID sort for stable pagination
    orderBy.push({ id: 'asc' });

    // 6. Execute Database Query
    const [data, total] = await Promise.all([
      this.prisma.employees.findMany({
        skip,
        take,
        where, // Uses the dynamic 'where' object
        orderBy,
      }),
      this.prisma.employees.count({ where }),
    ]);

    return { data, meta: { total, skip, take } };
  }


  async createEmployee(newEmp: CreateEmployeeDto) {
    try {
      const employee = await this.prisma.employees.create({
        data: newEmp,
      });
      return employee;
    } catch (error) {
      // Handle unique constraint violations (P2002) if you have unique fields (e.g. email)
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Employee already exists (unique constraint violation).');
      }
      throw error;
    }
  }


  async updateEmployee(params: UpdateEmployeeDto) {
    const { id, ...data } = params;

    try {
      return await this.prisma.employees.update({
        where: { id },
        data: data,
      });
    } catch (error) {
      // P2025: An operation failed because it depends on one or more records that were required but not found.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }
      throw error;
    }
  }


  async deleteEmployee(id: string): Promise<void> {
    try {
      await this.prisma.employees.delete({
        where: { id },
      });
    } catch (error) {
      // P2025: Record to delete does not exist
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }
      throw error;
    }
  }


  async getStats(params: EmployeeStatsDto) {
    const { groupBy } = params;

    // Prisma groupBy query
    const result = await this.prisma.employees.groupBy({
      by: [groupBy as any], // Cast needed because Prisma types are strict on literal unions
      _count: {
        id: true, // Count number of employees in this group
      },
      _avg: {
        monthlyIncome: true,
        age: true,
        yearsAtCompany: true,
        engagementScore: true,
        // performanceRating: true, // Enum values are stored as strings? Prisma _avg only works on Int/Float. 
        // Note: performanceRating is an Enum in your schema, so _avg won't work on it directly unless mapped to Int.
        // We will stick to numeric fields for _avg.
        workloadPressureIndex: true,
      },
    });

    // Format the result for easier frontend consumption
    return result.map((group) => ({
      group: group[groupBy], // e.g., "Sales"
      count: group._count.id,
      averageSalary: Math.round(group._avg.monthlyIncome || 0),
      averageAge: Math.round(group._avg.age || 0),
      averageTenure: parseFloat((group._avg.yearsAtCompany || 0).toFixed(1)),
      avgEngagement: parseFloat((group._avg.engagementScore || 0).toFixed(1)),
      avgWorkload: parseFloat((group._avg.workloadPressureIndex || 0).toFixed(1)),
    }));
  }
}