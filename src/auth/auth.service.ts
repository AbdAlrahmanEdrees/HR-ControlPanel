import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
// import * as env from 'dotenv';
// import { SignupDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { EmailService } from 'src/auth/email/email.service';
import { ApprState, UserRole } from 'generated/prisma/enums';
import { VerifingDto } from './dto/verification.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
// env.config();
@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private emailService: EmailService
    ) { }



    // async signupLocal(dto: SignupDto): Promise<string> {
    //     // Use findUnique() to benefit from the unique index on email
    //     const existingUser = await this.prisma.users.findFirst({
    //         where: {
    //             OR: [
    //                 { email: dto.email },
    //                 { phone: dto.phone }
    //             ]
    //         },
    //     });

    //     if (existingUser) {
    //         const message = "This email or phone number is already registered!";
    //         throw new ForbiddenException(message);
    //     }

    //     // ************************************************
    //     // ***********Email Verification Code**************
    //     // ************************************************     
    //     const hashedPassword = await this.hashData(dto.password);

    //     const newUser = await this.prisma.users.create({
    //         data: {
    //             name: dto.name,
    //             email: dto.email,
    //             phone: dto.phone,
    //             hashedPassword: hashedPassword,


    //         },
    //     });
    //     this.sendVerificationCode(newUser.id);
    //     // const tokens = await this.getTokens(newUser.id, newUser.email);

    //     // await this.updateRtHash(newUser.id, tokens.refresh_token);

    //     // return tokens;
    //     return newUser.id;
    // }


    async signinLocal(dto: SignInDto) {
        // 1. Find User (Cleaner lookup logic)
        // If email is provided, search by email. If not, search by phone.
        const user = await this.prisma.users.findUnique({
            where: dto.email ? { email: dto.email } : { phone: dto.phone }
        });

        // 2. Validate User Existence
        if (!user) {
            throw new UnauthorizedException("Incorrect email or password!");
        }

        // 3. Validate Password
        const passwordMatches = await bcrypt.compare(dto.password, user.hashedPassword);
        if (!passwordMatches) {
            throw new UnauthorizedException("Incorrect email or password!");
        }

        // 4. Check Verification Status
        if (user.approvalState === ApprState.NOT_VERIFIED) {
            await this.sendVerificationCode(user.id);

            // IMPROVEMENT: Return an object, not just a string, to keep JSON consistency
            return {
                verificationId: user.id,
                message: "Email verification required. Code sent."
            };
        }

        // 5. Generate and Return Tokens
        const tokens = await this.getTokens(user.id, user.email, user.role);
        await this.updateRtHash(user.id, tokens.refresh_token);

        return tokens;
    }

    async logout(userId: string) {
        await this.prisma.users.updateMany({
            where: {
                id: userId,
                hashedRefreshToken: {
                    not: null
                }
            },
            data: {
                hashedRefreshToken: null
            }
        })

    }

    async resetPassword(dto: ResetPasswordDto) {
        const user = await this.prisma.users.findUnique({
            where: {
                id: dto.userId,
                email: dto.email
            }
        });
        if (!user) {
            throw new ForbiddenException();
        }
        if (!user.verificationCode_ExpiresAt) {
            throw new ForbiddenException();
        }

        const now = new Date();

        if (user.verificationCode_ExpiresAt < now || user.verificationCode !== dto.code) {
            const errMsg = "Incorrect verification code";
            throw new ForbiddenException(errMsg);
        }
        const hashedPassword = await this.hashData(dto.newPassword);
        await this.prisma.users.update({
            where: {
                id: dto.userId
            },
            data: {
                hashedPassword: hashedPassword
            }
        });

    }

    async verifyAccount(dto: VerifingDto): Promise<Tokens> {
        const user = await this.prisma.users.findUnique({ where: { id: dto.userId } });

        if (!user) {
            throw new ForbiddenException();
        }
        if (!user.verificationCode_ExpiresAt) {
            throw new ForbiddenException();
        }

        const now = new Date();

        if (user.verificationCode_ExpiresAt < now || user.verificationCode! != dto.code) {
            const errMsg = "Incorrect verification code";
            throw new ForbiddenException(errMsg);
        }

        await this.prisma.users.update({ where: { id: dto.userId }, data: { approvalState: 'VERIFIED' } });

        const tokens = await this.getTokens(user.id, user.email, user.role);
        await this.updateRtHash(user.id, tokens.refresh_token);
        return tokens;
    }


    async refreshTokens(userId: string, rt: string): Promise<Tokens> {
        const user = await this.prisma.users.findUnique({
            where: {
                id: userId
            }
        });
        if (!user?.hashedRefreshToken) {
            const errMsg = "Access denied. Please log in again.";
            throw new ForbiddenException(errMsg);
        }

        const rtMatches = await bcrypt.compare(rt, user.hashedRefreshToken);
        if (!rtMatches) {
            const errMsg = "Access denied. Please log in again.";
            throw new ForbiddenException(errMsg);
        }

        const tokens = await this.getTokens(user.id, user.email, user.role);

        await this.updateRtHash(user.id, tokens.refresh_token);

        return tokens;
    }

    async sendVerificationCode(userId: string) {
        const user = await this.prisma.users.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            throw new ForbiddenException();
        }
        if (user.verificationCode_ExpiresAt) {
            const expiresAt = user.verificationCode_ExpiresAt.getTime();

            const lastSentAt = expiresAt - 10 * 60 * 1000;        // subtract 10 minutes
            const nextAllowedSendAt = lastSentAt + 60 * 1000;     // +1 minute cooldown

            if (Date.now() < nextAllowedSendAt) {
                throw new ForbiddenException(
                    "Please wait a minute before requesting a new verification code."
                );
                // throw new ForbiddenException();
            }
        }

        const code = Math.floor(10000 + Math.random() * 90000);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await this.emailService.sendVerificationCode(user.email, code);
        await this.prisma.users.update({
            where: { id: user.id },
            data: {
                verificationCode: code,
                verificationCode_ExpiresAt: expiresAt
            }
        });
    }



    /*
    helper function:
    */


    public hashData(data: string) {
        return bcrypt.hash(data, 10);
    }

    async getTokens(userId: string, email: string, role: UserRole) {
        // you can use whatever data you want.
        // But it should be public data, not something like password.
        const payload = {
            sub: userId,
            email: email,
            rolee: role
        };

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: process.env.AT_SECRET,
            expiresIn: 5 * 60, //1 minutes
        });

        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: process.env.RT_SECRET,
            expiresIn: 60 * 60 * 24 * 30 //a month
        });
        return {
            access_token: accessToken,
            refresh_token: refreshToken

        }
    }

    async updateRtHash(userId: string, refreshToken: string) {
        const rtHashed = await this.hashData(refreshToken);
        await this.prisma.users.update({
            where: { id: userId }, data: {
                hashedRefreshToken: rtHashed,
            }
        });

    }

}
