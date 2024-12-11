import { Controller, Post, Body, UseGuards, Get, Request, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JWTGuard } from "./auth.guard";
import { ApiOperation, ApiBody, ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";
import { User } from "src/users/schemas/user.entity";

@Controller('auth')
@ApiTags('权限')
@ApiBearerAuth('Authorization')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: '登录' })
    @ApiBody({ description: '用户名和密码', type: LoginDto })
    async login(@Body() user: LoginDto) {
        const userInfo = await this.authService.validateUser(user.name, user.password)

        if (!userInfo) throw new UnauthorizedException('用户名或密码错误')

        return this.authService.login(userInfo)
    }

    @UseGuards(JWTGuard)
    @Get('logout')
    @ApiOperation({ summary: '退出' })
    logout(@Request() req: Request) {
        return this.authService.logout(req.headers['authorization'])
    }

    @UseGuards(JWTGuard)
    @Get('profile')
    @ApiOperation({ summary: '获取用户信息' })
    profile(@Request() req: Request): Promise<User | null> {
        return this.authService.profile(req.headers['authorization'])
    }
}
