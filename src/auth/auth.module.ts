import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from './auth.service';
import { JwtStrategy } from './dto/strategy.service';
@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
