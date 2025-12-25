import { ConflictException, Injectable } from '@nestjs/common';
import { Users } from 'generated/prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateUserDto } from './dto/create.user.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService, private readonly authService: AuthService) { }

    async findAll(): Promise<Users[]> {
        try {
            const users = await this.prisma.users.findMany();
            return users;
        } catch (err) {
            throw err;
        }
    }

    async search(search: string): Promise<Users[]> {
        try {
            const users = await this.prisma.users.findMany({
                where: {
                    OR: [
                        // contains: term, mode: 'insensitive' makes it case-insensitive (Postgres)
                        { id: { contains: search, mode: 'insensitive' } },
                        { name: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                        { phone: { contains: search, mode: 'insensitive' } },
                    ]
                }
            });

            return users;
        } catch (err) {
            throw err;
        }
    }


    async deleteUser(id: string) {
        try {
            await this.prisma.users.delete({
                where: {
                    id: id
                }
            });
        } catch (err) {
            throw err;
        }
    }

    async addUser(user: CreateUserDto): Promise<string> {
        // Hash the password (using your existing authService)
        const passHash = await this.authService.hashData(user.password);

        try {
            await this.prisma.users.create({
                data: {
                    name: user.name,
                    email: user.email,
                    hashedPassword: passHash,
                    phone: user.phone,
                    role: user.role // This is unsafe, always better to use objects in the prisma client: for example:
                    //role: 'SUPER_ADMIN' <- will work, because it is stored also like this in the db (there is no @map in the schema.prisma) BUT:
                    //role: UserRole.SUPER_ADMIN <- is better, and safe.
                    // If you still don't know what I mean, what you are doing now is that you are using a string (see CreateUserDto), not the object.
                }
            });

            return "user added successfully; But, email verification will be required in the first sign-in";
        } catch (error) {
            // Optional: specific error handling
            if (error.code === 'P2002') {
                throw new ConflictException('Email or Phone already taken');
            }
            throw error;
        }
    }
}
