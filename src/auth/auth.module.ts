import { Module } from "@nestjs/common";
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { UsersModule } from "src/users/users.module";

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            secret: 'x-i-a-n-f-u',
            signOptions: { expiresIn: '1h' },
        }),
        PassportModule
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService, JwtStrategy]
})
export class AuthModule { }

