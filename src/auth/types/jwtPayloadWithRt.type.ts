import { JwtPayload } from "./jwtPayload.type";

export type jwtPayloadWithRt = JwtPayload & {refreshToken : string}