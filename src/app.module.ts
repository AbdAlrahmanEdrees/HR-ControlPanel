import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core'; // Import APP_GUARD
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './auth/email/email.module'; // Ensure path is correct
import { PrismaModule } from './common/prisma/prisma.module';
import { AtGuard } from './common/guards/at.guard';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { EmployeesModule } from './employees/employees.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    EmailModule,
    UsersModule,
    EmployeesModule,
  ],
  providers: [
    // This forces the AtGuard to run on EVERY request in the application.
    // Now by default every signel endpoint in the application will be protected.
    // ! ! ! some should be open ! ! !
    // you open the endpoint with the @MyPublic decorator, this makes it pass the AtGuard.
    {
      provide: APP_GUARD,
      useClass: AtGuard, 
      // Later, passport looks up a registered strategy named 'jwt'
      // It will be registered before that.
      // auth.module will have registered it before that.
    },
  ],
  controllers: [AppController],
})
export class AppModule {}