import { Injectable } from '@nestjs/common';
import { Employees } from 'generated/prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class EmployeesService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(skip: number, take: number): Promise<Employees[]> {
        const employees = await this.prisma.employees.findMany({
            skip: skip,
            take: take,
            orderBy: {
                id: 'asc', // <--- CRITICAL for stable pagination
            }
        });
        return employees;
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
        await this.prisma.employees.delete({
            where: {
                id: id
            }
        });
    }
}
