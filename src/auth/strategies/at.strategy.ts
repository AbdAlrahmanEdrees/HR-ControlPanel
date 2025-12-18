import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types/jwtPayload.type';
import { ConfigService } from '@nestjs/config';
// Import the environment variables setup if needed, but typically done globally


@Injectable()
// 1. Inherit from PassportStrategy(Strategy, NAME)
// The NAME ('jwt') is used later in the AuthGuard('jwt')
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: ConfigService) {
        super({
            // 2. Tell the strategy where to find the token (Bearer token in the Authorization header)
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // 3. Set to false: Passport must check if the token's expiration date (exp) is valid
            ignoreExpiration: false, // false is the default
            // 4. Provide the secret key used to SIGN the Access Token
            // secretOrKey: process.env.AT_SECRET!, // Ensure this matches the secret in auth.service.ts
            // Best Practice: Use ConfigService to get env variables
            secretOrKey: config.get<string>('AT_SECRET')!,
        });
    }

    // 5. Validation Method: This runs after the token is successfully decoded and verified.
    validate(payload: JwtPayload): JwtPayload {
        // The decoded payload (sub and email) is returned.
        // NestJS attaches this returned object to the `req.user` property.

        // If you are curious like me :)
        // There is no req.user by default in Node.js, Express.js or NestJs.
        // req.user is created at runtime by Passport.

        // WARNING: you have to make extra check that the 'at' is provided in the header.
        // because in the future you could write this in the constructor:
        // jwtFromRequest: ExtractJwt.fromExtractors([
        //     ExtractJwt.fromAuthHeaderAsBearerToken(),
        //     ExtractJwt.fromBodyField('refreshToken'),
        //     ExtractJwt.fromCookies('rt'),
        // ])

        return payload;
    }
}


