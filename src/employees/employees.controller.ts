import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    HttpStatus,
    HttpCode,
    ParseIntPipe,
    ParseUUIDPipe,
    DefaultValuePipe,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiQuery,
    ApiBody,
    ApiBearerAuth,
    ApiExtraModels,
    getSchemaPath,
    ApiParam,
    ApiOkResponse,
    ApiCreatedResponse,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

// Services & Guards
import { EmployeesService } from './employees.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AtAuthorizationHeader } from 'src/common/decorators/at-authorization.decorator';
import { UserRole } from 'generated/prisma/enums';


// DTOs & Entities
import { EmployeeQueryDto } from './dto/employee-query.dto';
import { CreateEmployeeDto } from './dto/create.employee.dto';
import { UpdateEmployeeDto } from './dto/update.employee.dto';
import { EmployeeEntity } from './entities/employee.entity'; // <--- The file we just created
import { EmployeeStatsDto } from './dto/employee-stats.dto';

@ApiTags('Employees')
@AtAuthorizationHeader()
@Controller('employees')
@ApiExtraModels(EmployeeEntity) // <--- CRITICAL: Registers the Entity class for Swagger schema generation
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) { }

    @Get()
    @ApiOperation({
        summary: 'Query employees',
        description:
            'Retrieve a paginated list of employees with comprehensive filtering capabilities (ranges, enums, exact matches) and sorting.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns paginated employee data.',
        schema: {
            properties: {
                data: {
                    type: 'array',
                    items: { $ref: getSchemaPath(EmployeeEntity) }, // <--- References the Class correctly
                },
                meta: {
                    type: 'object',
                    properties: {
                        total: { type: 'number', example: 50 },
                        skip: { type: 'number', example: 0 },
                        take: { type: 'number', example: 10 },
                    },
                },
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid query parameters (e.g. invalid enum value or number type).',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error.',
    })
    async findAll(@Query() query: EmployeeQueryDto) {
        return this.employeesService.findAll(query);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @ApiOperation({
        summary: 'Create an employee',
        description: 'Creates a new employee. Restricted to SUPER_ADMIN users only.',
    })
    @ApiBearerAuth()
    @ApiBody({
        type: CreateEmployeeDto,
        required: true,
        description: 'New employee data without id',
    })
    @ApiCreatedResponse({
        description: 'Employee created successfully',
        type: EmployeeEntity,
    })
    @ApiBadRequestResponse({ description: 'Invalid payload or validation error' })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
    @ApiForbiddenResponse({ description: 'User is not SUPER_ADMIN' })
    async createEmployee(@Body() newEmp: CreateEmployeeDto) {
        return this.employeesService.createEmployee(newEmp);
    }

    @Put()
    @UseGuards(RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @ApiOperation({
        summary: 'Update an employee',
        description: 'Updates an existing employee. Restricted to SUPER_ADMIN users only.',
    })
    @ApiBearerAuth()
    @ApiBody({
        type: UpdateEmployeeDto,
        required: true,
        description: 'Complete employee data including a valid employee id',
    })
    @ApiOkResponse({
        description: 'Employee updated successfully',
        type: EmployeeEntity,
    })
    @ApiBadRequestResponse({ description: 'Invalid payload or validation error' })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
    @ApiForbiddenResponse({ description: 'User is not SUPER_ADMIN' })
    @ApiNotFoundResponse({ description: 'Employee with the given id was not found' })
    async updateEmployee(@Body() updatedEmp: UpdateEmployeeDto) {
        return this.employeesService.updateEmployee(updatedEmp);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Delete an employee',
        description: 'Restricted to SUPER_ADMIN.',
    })
    @ApiBearerAuth()
    @ApiParam({ name: 'id', description: 'UUID of the employee' })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Employee deleted successfully.',
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Requires SUPER_ADMIN role.',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Employee not found.',
    })
    async deleteEmployee(@Param('id', ParseUUIDPipe) id: string) {
        return this.employeesService.deleteEmployee(id);
    }


    @Get('stats')
    @ApiOperation({
        summary: 'Get employee statistics (Aggregation)',
        description: 'Aggregates employee data by a specific category (e.g., Department, JobRole). Returns counts and averages for key metrics like Monthly Income, Age, and Satisfaction scores.',
    })
    @ApiQuery({
        name: 'groupBy',
        description: 'The field to group data by (e.g. "department", "jobRole", "gender")',
        required: true,
        type: String,
        example: 'department',
    })
    @ApiOkResponse({
        description: 'Aggregation results returned successfully.',
        schema: {
            example: [
                {
                    "department": "Sales",
                    "_count": { "id": 15 },
                    "_avg": {
                        "monthlyIncome": 6500.50,
                        "age": 34.2,
                        "jobSatisfaction": 3.5
                    }
                },
                {
                    "department": "Research & Development",
                    "_count": { "id": 40 },
                    "_avg": {
                        "monthlyIncome": 7200.00,
                        "age": 38.1,
                        "jobSatisfaction": 2.9
                    }
                }
            ]
        }
    })
    @ApiBadRequestResponse({ description: 'Invalid groupBy field provided.' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error during aggregation.' })
    async getStats(@Query() query: EmployeeStatsDto) {
        return this.employeesService.getStats(query);
    }
}