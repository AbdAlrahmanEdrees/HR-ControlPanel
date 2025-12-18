import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { JwtPayload } from '../types/jwtPayload.type';
import { jwtPayloadWithRt } from '../types/jwtPayloadWithRt.type';
import { ConfigService } from '@nestjs/config';
dotenv.config();

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            // secretOrKey: process.env.RT_SECRET!,
            secretOrKey: config.get<string>('RT_SECRET')!,
            passReqToCallback: true,// ==> validate(req,payload)    
        });
        // Execution steps (after an endpoint with @UseGuard(AuthGuard('jwt-refresh')) gets hit):
        // 1- Passport calls your extractor: jwtFromRequest(req) -> string | null
        // 2- If the extractor returns null -> request is rejected
        //    If: string -> passport continues
        // 3- Passport verifies that string: Signature, Expiration, Secret
        // 4- Only after that, validate() is called.
    }

    validate(req: Request, payload: JwtPayload): jwtPayloadWithRt {
        // WE HAVE TO CHECK:
        // And probably you will ask why, would the execution reach this point
        // if the refresh-token wasn't provided in the header??
        // The answer is:
        // Passport doesn't guarantee that the refresh token exists in req.headers.authorization.
        // It only guarantees that "A token was extracted by jwtFromRequest() and verified successfully"
        const authHeader = req.get('Authorization');
        const refreshToken = authHeader?.replace(/Bearer\s+/i, '').trim();

        if (!refreshToken) {
            throw new UnauthorizedException();
        }
        // WE DID THIS EXTRA CHECK IN CASE IN THE FUTURE YOU could write this in the constructor:
        // jwtFromRequest: ExtractJwt.fromExtractors([
        //     ExtractJwt.fromAuthHeaderAsBearerToken(),
        //     ExtractJwt.fromBodyField('refreshToken'),
        //     ExtractJwt.fromCookies('rt'),
        // ])

        return {
            ...payload,
            refreshToken,
        };
    }
}