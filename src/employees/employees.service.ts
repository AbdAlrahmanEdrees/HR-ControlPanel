import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Employees, Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UpdateEmployeeDto } from './dto/update.employee.dto';
import { CreateEmployeeDto } from './dto/create.employee.dto';

@Injectable()
export class EmployeesService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(skip: number, take: number): Promise<Employees[]> {
        try {
            const employees = await this.prisma.employees.findMany({
                skip: skip,
                take: take,
                orderBy: {
                    id: 'asc', // <--- CRITICAL for stable pagination
                }
            });
            return employees;
        } catch (err) {
            throw err;
        }
    }

    // async search(search: string, skip: number, give: number) {
    //     const employees=this.prisma.employees.findMany({
    //         skip:skip,
    //         take:take,
    //         where:{

    //         }
    //     })
    // }

    async deleteEmployee(id: string): Promise<void> {
        try {
            const exists = await this.prisma.employees.findUnique({
                where: { id },
            });

            if (!exists) {
                throw new NotFoundException(`Employee with id ${id} not found`);
            }

            await this.prisma.employees.delete({
                where: { id },
            });
        } catch (err) {
            throw err;
        }
    }



    async updateEmployee(updatedEmp: UpdateEmployeeDto) {
        const { id, ...data } = updatedEmp;

        // Ensure employee exists
        const existingEmployee = await this.prisma.employees.findUnique({
            where: { id },
        });

        if (!existingEmployee) {
            throw new NotFoundException(`Employee with id ${id} not found`);
        }

        try {
            // Update employee
            return this.prisma.employees.update({
                where: { id },
                data,
            });
        }
        catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                throw new BadRequestException(err.message);
            }
            throw err;
        }
    }



    async createEmployee(newEmp: CreateEmployeeDto) {
        try {
            return await this.prisma.employees.create({
                data: newEmp,
            });
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                throw new BadRequestException(err.message);
            }
            throw err;
        }
    }


    //#########################################################################
    //########################## Custom Search ################################
    //#########################################################################

    async getBestPerformanceEmployees(
        skip: number,
        take: number,
    ) {
        //     “Best performance” = highest performanceRating
        // Secondary sort by engagementScore to stabilize ranking

        // I discovered that the try-catch is not needed:
        //         Prisma throws an exception (promise rejection)
        // NestJS automatically catches it at the framework level
        return this.prisma.employees.findMany({
            skip,
            take,
            orderBy: [
                {
                    performanceRating: 'desc',
                },
                {
                    engagementScore: 'desc',
                },
                {
                    id: 'asc', // stable pagination
                },
            ],
        });
    }

}
