-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "ApprState" AS ENUM ('VERIFIED', 'NOT_VERIFIED');

-- CreateEnum
CREATE TYPE "AttritionType" AS ENUM ('Yes', 'No');

-- CreateEnum
CREATE TYPE "OvertimeType" AS ENUM ('Yes', 'No');

-- CreateEnum
CREATE TYPE "BusinessTravelType" AS ENUM ('Non-Travel', 'Travel_Rarely', 'Travel_Frequently');

-- CreateEnum
CREATE TYPE "DepartmentType" AS ENUM ('Research & Development', 'Sales', 'Human Resources');

-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('Below College', 'College', 'Bachelor', 'Master', 'Doctor');

-- CreateEnum
CREATE TYPE "EducationFieldType" AS ENUM ('Life Sciences', 'Medical', 'Marketing', 'Technical Degree', 'Human Resources', 'Other');

-- CreateEnum
CREATE TYPE "JobRoleType" AS ENUM ('Sales Executive', 'Research Scientist', 'Laboratory Technician', 'Manufacturing Director', 'Healthcare Representative', 'Manager', 'Sales Representative', 'Research Director', 'Human Resources');

-- CreateEnum
CREATE TYPE "MaritalStatusType" AS ENUM ('Single', 'Married', 'Divorced');

-- CreateEnum
CREATE TYPE "SatisfactionRating" AS ENUM ('Low', 'Medium', 'High', 'Very High');

-- CreateEnum
CREATE TYPE "PerformanceRating" AS ENUM ('Low', 'Good', 'Excellent', 'Outstanding');

-- CreateEnum
CREATE TYPE "AttritionRiskClass" AS ENUM ('Low', 'Medium', 'High');

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "approvalState" "ApprState" NOT NULL DEFAULT 'NOT_VERIFIED',
    "verificationCode" INTEGER,
    "verificationCode_ExpiresAt" TIMESTAMP(3),
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50),
    "hashedPassword" TEXT NOT NULL,
    "hashedRefreshToken" TEXT,
    "hashedAccessToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employees" (
    "id" TEXT NOT NULL,
    "attrition" "AttritionType" NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "maritalStatus" "MaritalStatusType" NOT NULL,
    "distanceFromHome" INTEGER NOT NULL,
    "monthlyIncome" INTEGER NOT NULL,
    "percentSalaryHike" INTEGER NOT NULL,
    "jobLevel" INTEGER NOT NULL,
    "jobRole" "JobRoleType" NOT NULL,
    "businessTravel" "BusinessTravelType" NOT NULL,
    "department" "DepartmentType" NOT NULL,
    "education" "EducationLevel" NOT NULL,
    "educationField" "EducationFieldType" NOT NULL,
    "numCompaniesWorked" INTEGER NOT NULL,
    "totalWorkingYears" INTEGER NOT NULL,
    "trainingTimesLastYear" INTEGER NOT NULL,
    "trainingHoursLastYear" INTEGER NOT NULL,
    "trainingHoursLast6Months" INTEGER NOT NULL,
    "trainingGapScore" INTEGER NOT NULL,
    "yearsAtCompany" INTEGER NOT NULL,
    "yearsInCurrentRole" INTEGER NOT NULL,
    "yearsSinceLastPromotion" INTEGER NOT NULL,
    "yearsWithCurrManager" INTEGER NOT NULL,
    "environmentSatisfaction" "SatisfactionRating" NOT NULL,
    "jobInvolvement" "SatisfactionRating" NOT NULL,
    "jobSatisfaction" "SatisfactionRating" NOT NULL,
    "performanceRating" "PerformanceRating" NOT NULL,
    "relationshipSatisfaction" "SatisfactionRating" NOT NULL,
    "workLifeBalance" "SatisfactionRating" NOT NULL,
    "overTime" "OvertimeType" NOT NULL,
    "absenceDaysLastMonth" INTEGER NOT NULL,
    "absenceDaysLast3Months" INTEGER NOT NULL,
    "absenceRatio" DOUBLE PRECISION NOT NULL,
    "lateArrivalsLastMonth" INTEGER NOT NULL,
    "overtimeHoursLastMonth" DOUBLE PRECISION NOT NULL,
    "workloadPressureIndex" INTEGER NOT NULL,
    "engagementScore" INTEGER NOT NULL,
    "managerFeedbackScore" INTEGER NOT NULL,
    "roleStabilityRatio" DOUBLE PRECISION NOT NULL,
    "attritionRiskClass" "AttritionRiskClass" NOT NULL,

    CONSTRAINT "Employees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_key" ON "Users"("phone");
