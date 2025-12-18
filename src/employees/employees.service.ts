import { Injectable } from '@nestjs/common';
import { Employees } from 'generated/prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

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
            await this.prisma.employees.delete({
                where: {
                    id: id
                }
            });
        } catch (err) {
            throw err;
        }
    }
}
