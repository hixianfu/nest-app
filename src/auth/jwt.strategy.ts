import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'x-i-a-n-f-u',
        })
    }

    async validate(payload: any) {
        const token = await this.authService.validateToken(payload.id)

        if (!token) {
            throw new UnauthorizedException('请先登录')
        }
        return { userId: payload.sub, name: payload.name }
    }
}
