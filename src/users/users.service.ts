import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, MoreThan, Repository, UpdateResult } from 'typeorm';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { User } from './schemas/user.entity';
import * as bcrypt from 'bcrypt'
import { RegisterDTO } from './dto/register.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRedis() private redis: Redis,
    ) { }

    /**
     * 获取所有用户
     * @returns 
     */
    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    /**
     * 根据ID查询用户
     * @param id 
     * @returns 
     */
    findById(id: number): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } });
    }

    /**
     * 根据条件查询用户
     * @param condition 
     * @returns 
     */
    findByCondition(condition: FindOptionsWhere<User>): Promise<User[]> {
        const whereCondition: FindOptionsWhere<User> = {};

        const conditionHandlers = {
            age_gt: (value: number) => ({ age: value ? MoreThan(value) : undefined }),
            default: (value: any, key: string) => ({ 
                [key]: typeof value === 'string' ? ILike(`%${value}%`) : value 
            })
        };


        Object.entries(condition).forEach(([key, value]) => {
            const handler = conditionHandlers[key] || conditionHandlers.default;
            Object.assign(whereCondition, handler(value, key));
        });

        // 移除未定义的条件
        Object.keys(whereCondition).forEach(key => 
            whereCondition[key] === undefined && delete whereCondition[key]
        );

        return this.userRepository.find({ where: whereCondition });
    }

    /**
     * 创建用户
     * @param user 
     * @returns 
     */
    create(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    /**
     * 分页查询用户
     * @param page 页码 
     * @param pageSize 每页条数
     * @returns 
     */
    async findByPage(page: number, pageSize: number): Promise<{ list: User[], total: number }> {
        const users = await this.redis.get(`users:${page}:${pageSize}`);

        if(users) { 
            return JSON.parse(users);
        }

        const result = await this.userRepository.find({ skip: (page - 1) * pageSize, take: pageSize });

        this.redis.set(`users:${page}:${pageSize}`, JSON.stringify(result), 'EX', 30);

        return {
            list: result,
            total: await this.userRepository.count()
        };
    }

    /**
     * 根据条件更新用户信息
     * @param condition 条件
     * @param user 用户信息
     * @returns 
     */
    updateByCondition(updateData: Partial<User>, userId: number): Promise<UpdateResult> {
        return this.userRepository.update({ id: userId}, updateData);
    }

    /**
     * 注册
     * @param to 
     * @returns 
     */
    async register(user: User & { code: string }): Promise<User> {
        const { code, ...userData } = user;

        const DBUser = await this.findByCondition({ email: userData.email });
        if(DBUser.length >  0) {
            throw new BadRequestException('用户已存在');
        }

        const redisCode = await this.redis.get(user.email);

        if(!redisCode) {
            throw new BadRequestException('验证码已过期');
        }

        if(redisCode !== code) {
            throw new BadRequestException('验证码错误');
        }

        userData.password = await bcrypt.hash(userData.password, 10);

        const newUser = await this.create(userData);
        await this.redis.del(user.email);

        return newUser;
    }

    /**
     * 重置密码
     * @param user 
     * @returns 
     */
    async reset(user: RegisterDTO): Promise<null> {
        const { code, email, password } = user;

        const DBUser = await this.findByCondition({ email });
        if(DBUser.length === 0) {
            throw new BadRequestException('用户不存在');
        }

        const redisCode = await this.redis.get(user.email);

        if(!redisCode) {
            throw new BadRequestException('验证码已过期');
        }

        if(redisCode !== code) {
            throw new BadRequestException('验证码错误');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await this.updateByCondition({ password: hashedPassword }, DBUser[0].id);

        if(newUser.affected === 0) {
            throw new BadRequestException('重置密码失败');
        }

        await this.redis.del(user.email);

        return null;
    }
}
