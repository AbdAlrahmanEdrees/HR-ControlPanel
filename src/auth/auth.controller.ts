import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Tokens } from './types';
import { SignInDto } from './dto/signin.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from './types/jwtPayload.type';
import { jwtPayloadWithRt } from './types/jwtPayloadWithRt.type';
import { VerifingDto } from './dto/verification.dto';
import { AtAuthorizationHeader } from 'src/common/decorators/at-authorization.decorator';
import { UserIdDto } from './dto/resend-verification-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MyPublic } from '../common/decorators/public.decorator';

// Create a typed Request interface for cleaner access to user data
interface LogoutRequest extends Request {
  user: JwtPayload;
}
interface RefreshRequest extends Request {
  user: jwtPayloadWithRt;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // @MyPublic() // <--- This allows access without an Access Token
  // @Post('local/signup')
  // @HttpCode(HttpStatus.CREATED)
  // @ApiBody({ type: SignupDto })
  // @ApiResponse({ status: 201, description: 'Signup succeeded / Created successfully' })
  // @ApiResponse({ status: 400, description: 'Bad Request, doesn\'t match the Dto blue-print' })
  // @ApiResponse({ status: 403, description: 'Signup failed' })
  // signupLocal(@Body() dto: SignupDto): Promise<string> {
  //   return this.authService.signupLocal(dto);
  // }

  @MyPublic()
  @Post("local/signin")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Sign in using email or phone",
    description: "Provide either **email** or **phone** to login."
  })
  @ApiBody({ type: SignInDto })
  // DOCUMENTATION: Success Response (Union Type Logic)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Signin successful. Returns Tokens OR a Verification Object if email is not verified.',
    schema: {
      oneOf: [
        {
          properties: {
            access_token: { type: 'string' },
            refresh_token: { type: 'string' }
          }
        },
        {
          properties: {
            verificationId: { type: 'string', description: 'User ID needed for OTP' },
            message: { type: 'string' }
          }
        }
      ]
    }
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validation failed (missing email/phone)' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid Credentials (wrong email or password)' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Access Denied (User is banned)' })
  async signinLocal(@Body() dto: SignInDto) {
    return this.authService.signinLocal(dto);
  }

  //@UseGuards(AuthGuard('jwt')) <-- no need anymore
  @Post('logout')
  @ApiBody({})
  @AtAuthorizationHeader()
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiResponse({ status: 401, description: "Unauthorized (expired access_token)" })
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: LogoutRequest): Promise<void> {
    // This code ONLY runs if the Access Token is valid and not expired.

    // The data returned by AtStrategy's validate() method is now in req.user
    const user = req.user;
    return this.authService.logout(user['sub']);
  }

  // Refresh Token Endpoint
  // Note: We use the RT Guard specifically here. 
  // Because the Global Guard (AtGuard) is running, we usually mark this @Public() 
  // to bypass the 'jwt' check, and let the 'jwt-refresh' guard handle it.
  @MyPublic()
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('/refresh')
  @ApiBody({})
  @ApiHeader({
    name: 'Authorization',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNGI1ZDJjMy0zZGE1LTRkNmUtOWE0ZS1mMDg4Yzc1NDMzZjIiLCJlbWFpbCI6ImFiZG8uMTYyODg4OEBnbWFpbC5jb20iLCJpYXQiOjE3NjQyMzQ4MTYsImV4cCI6MTc2NDIzNTcxNn0.nqlK50B41j_YRo7rxLn1hI-H3rlL_Ra3I8WvtQ7_Ngo ',
    description: "Should be like this: 'Bearer refresh_token'",
    required: false
  })
  @ApiResponse({ status: 200, description: 'AccessToken was refreshed successfully' })
  @ApiResponse({ status: 403, description: "User Should be Logged Out. not-exit || expired-RT || banned" })
  @HttpCode(HttpStatus.OK)
  refreshTokens(@Req() req: RefreshRequest): Promise<Tokens> {
    const user = req.user;
    return this.authService.refreshTokens(user.sub, user.refreshToken);
  }

  @MyPublic()
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: VerifingDto })
  @ApiResponse({ status: 403, description: "verification code wrong or expired" })
  verifyAccount(@Body() dto: VerifingDto): Promise<Tokens> {
    return this.authService.verifyAccount(dto);
  }

  @MyPublic()
  @Post('resend-verification-code')
  @ApiBody({ type: UserIdDto })
  resendVerificationCode(@Body() dto: UserIdDto) {
    return this.authService.sendVerificationCode(dto.userId);
  }

  @MyPublic()
  @Post('request-reset-password')
  @ApiBody({ type: UserIdDto })
  requestResetPassword(@Body() dto: UserIdDto) {
    return this.authService.sendVerificationCode(dto.userId);
  }

  @MyPublic()
  @Post('reset-password')
  @ApiBody({ type: ResetPasswordDto })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
