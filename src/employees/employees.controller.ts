import { Controller, Get, Query, DefaultValuePipe, ParseIntPipe, HttpStatus, Delete, Param, UseGuards, HttpCode, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiResponse, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { Employees, UserRole } from 'generated/prisma/client';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('Employees')
@Controller('employees')
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) { }

    @Get()
    @ApiOperation({
        summary: 'Get all employees (Paginated)',
        description: 'Retrieves a list of employees using pagination. Max limit per request is 100.'
    })
    // @ApiQuery({ name: 'search', required: false })
    @ApiQuery({
        name: 'skip',
        required: false,
        type: Number,
        description: 'Number of records to skip (offset). Defaults to 0.',
        example: 0
    })
    @ApiQuery({
        name: 'take',
        required: false,
        type: Number,
        description: 'Number of records to retrieve (limit). Defaults to 10. Max is 100.',
        example: 10
    }) // 'take' (standard)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The list of employees has been successfully retrieved.',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error.'
    })
    async findAll(
        // @Query('search') search?: string,
        // DefaultValuePipe ensures it has a value if missing
        // ParseIntPipe ensures "10" (string) becomes 10 (number)
        @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number = 0,
        @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number = 10,
    ): Promise<Employees[]> {
        if (take > 100) take = 100; // Safety limit

        // if (search) {
        //     return this.employeesService.search(search, skip, take);
        // }
        return this.employeesService.findAll(skip, take);
    }

    @UseGuards(RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT) // Standard for void returns
    @ApiBearerAuth() // Adds the lock icon
    @ApiOperation({ summary: 'Delete an employee', description: 'Restricted to SUPER_ADMIN.' })
    @ApiParam({ name: 'id', description: 'UUID of the employee' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Employee deleted successfully.' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Requires SUPER_ADMIN role.' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Employee not found.' })
    async deleteEmployee(@Param('id', ParseUUIDPipe) id: string) {
        // ParseUUIDPipe: to prevent database crashes on invalid IDs.
        return this.employeesService.deleteEmployee(id);
    }
}