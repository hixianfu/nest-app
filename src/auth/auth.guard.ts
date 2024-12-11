import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


@Injectable()
export class JWTGuard extends AuthGuard('jwt') {
    constructor() { super() }

    async canActivate(context: ExecutionContext) {
        try {
            // 获取请求对象，检查 Authorization header
            const request = context.switchToHttp().getRequest();

            const result = await super.canActivate(context)
            return result as boolean
        } catch (error) {
            throw new UnauthorizedException('认证失败：' + error.message)
        }
    }

    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new UnauthorizedException('请先登录')
        }
        return user
    }
}
