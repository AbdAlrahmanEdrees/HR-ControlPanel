import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { 
    ApiBadRequestResponse, 
    ApiBearerAuth, // <--- Imported
    ApiBody, 
    ApiConflictResponse, 
    ApiCreatedResponse, 
    ApiForbiddenResponse, // <--- Imported
    ApiOperation, 
    ApiParam, 
    ApiQuery, 
    ApiResponse, 
    ApiTags 
} from '@nestjs/swagger';
import { UserRole } from 'generated/prisma/client';
import { CreateUserDto } from './dto/create.user.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('Users') // Groups this under "Users" in Swagger UI
@ApiBearerAuth() // <--- Adds the "Authorize" lock icon to these endpoints
@ApiForbiddenResponse({ 
    description: 'Forbidden. Requires SUPER_ADMIN role.' // <--- Documents the 403 error for the whole controller
})
@UseGuards(RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@Controller('users')
export class UsersController {
    constructor(readonly usersService: UsersService) { }

    @Get() // Matches GET /users?search=something
    @ApiOperation({
        summary: 'Search or list users',
        description: 'Retrieves a list of users. If a search term is provided, it filters by name, email, or phone. IDs are checked for exact matches.'
    })
    @ApiQuery({
        name: 'search',
        required: false,
        type: String,
        description: 'Keyword to filter users. partial match for name/email/phone; exact match for ID.'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The list of users has been successfully retrieved.',
        // type: [UserResponseDto] // <--- Best Practice: Add your Response DTO here so Swagger generates an example JSON
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error.'
    })
    @HttpCode(HttpStatus.OK)
    // Matches GET /users?search=something
    async findAll(@Query('search') search?: string) {
        // No page, limit, or skip, because the users are all admins, and supposed to not be so many.
        if (search) {
            return this.usersService.search(search);
        }
        return this.usersService.findAll();
    }


    @Delete(':id')
    // ParseUUIDPipe ensures the ID is a valid UUID before it even hits your logic
    @HttpCode(HttpStatus.NO_CONTENT) // Sets response status to 204
    @ApiOperation({
        summary: 'Delete a user',
        description: 'Permanently removes a user record by their UUID.'
    })
    @ApiParam({
        name: 'id',
        description: 'The UUID of the user to delete',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'The user has been successfully deleted.'
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid UUID format supplied.'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User not found.'
    })
    async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.deleteUser(id);
    }

    @Post()
    @ApiOperation({
        summary: 'Register a new user',
        description: 'Creates a new user with a hashed password. Returns a success message.'
    })
    @ApiBody({ type: CreateUserDto })
    @ApiCreatedResponse({
        description: 'User successfully created.',
        schema: { example: 'user added successfully; But, email verification will be required in the first sign-in' }
    })
    @ApiBadRequestResponse({
        description: 'Validation failed (e.g. invalid email format).'
    })
    @ApiConflictResponse({
        description: 'Email or phone number already exists in the database.'
    })
    async addUser(@Body() user: CreateUserDto): Promise<string> {
        return this.usersService.addUser(user);
    }
}