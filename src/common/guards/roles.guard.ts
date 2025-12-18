// src/auth/guards/roles.guard.ts
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from 'generated/prisma/enums';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );


        // No roles required → allow
        if (!requiredRoles) return true;

        const { user } = context
            .switchToHttp()
            .getRequest<{ user: { role: UserRole } }>();

        if (!user || !user.role) {
            throw new UnauthorizedException('Role information missing');
        }

        const roleHierarchy: Record<UserRole, number> = {
            [UserRole.ADMIN]: 1,
            [UserRole.SUPER_ADMIN]: 2,
        };
        // If user's role isn't in the list, give them level 0
        const userLevel = roleHierarchy[user.role] || 0;

        // Find the minimum level required by the decorator
        // e.g. if @Roles(ADMIN, SUPER_ADMIN) -> min is 1. Both can access.
        const requiredLevel = Math.min(
            ...requiredRoles.map(r => roleHierarchy[r] || 0)
        );

        //  Compare
        if (userLevel < requiredLevel) {
            throw new ForbiddenException('Insufficient permissions');
        }

        return true;
    }
}
