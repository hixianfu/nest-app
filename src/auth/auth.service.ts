import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt'
import { User } from "src/users/schemas/user.entity";
import { InjectRedis } from "@nestjs-modules/ioredis";
import { Redis } from "ioredis";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        @InjectRedis() private redis: Redis
    ) { }

    async validateUser(name: string, password: string): Promise<any> {
        const user = await this.usersService.findByCondition({ name })
        if (user.length > 0 && await bcrypt.compare(password, user[0].password)) {
            const { password, ...result } = user[0]
            return result
        }
        return null
    }

    async profile(authorization: string) {
        const token = authorization.split(' ')[1]
        const userId = await this.jwtService.verify(token).id as number
        return await this.usersService.findById(userId)
    }

    async generateAccessToken(user: User) {
        const payload = { name: user.name, id: user.id, password: user.password};
        const token = this.jwtService.sign(payload);
        return token
    }

    async login(user: User) {
        const token = await this.generateAccessToken(user)
        const userInfo = await this.usersService.findByCondition({ name: user.name })

        await this.redis.set(`token:${userInfo[0].id}`, token, 'EX', 60 * 15);
        return {
            access_token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        }
    }

    async logout(token: string) {
        const userId = await this.jwtService.verify(token.split(' ')[1]).id as number
        await this.redis.del(`token:${userId}`)
    }

    async validateToken(userId: number): Promise<string | null> {
        return await this.redis.get(`token:${userId}`)
    }
}