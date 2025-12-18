import { ConflictException, Injectable } from '@nestjs/common';
import { Users } from 'generated/prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateUserDto } from './dto/create.user.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService, private readonly authService: AuthService) { }

    async findAll(): Promise<Users[]> {
        const users = await this.prisma.users.findMany();
        return users;
    }

    async search(search: string): Promise<Users[]> {
        const users = this.prisma.users.findMany({
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
    }


    async deleteUser(id: string) {
        await this.prisma.users.delete({
            where: {
                id: id
            }
        });
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
                    role: user.role
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
