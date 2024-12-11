import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cet4 } from "./schemas/cet4.entity";
import { Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { InjectRedis } from "@nestjs-modules/ioredis";

@Injectable()
export class Cet4Service {
    constructor(
        @InjectRepository(Cet4)
        private cet4Repository: Repository<Cet4>,
        @InjectRedis()
        private redis: Redis,
    ) {}

    /**
     * 根据ID查询单词
     * @param id 单词ID
     * @returns 单词
     */
    async findOne(id: number): Promise<Cet4 | null> {
        return this.cet4Repository.findOne({ where: { id } });
    }

    /**
     * 分页查询单词
     * @param page 页码
     * @param pageSize 每页条数
     * @returns 单词列表
     */
    async findByPage(page: number, pageSize: number): Promise<{ list: Cet4[], total: number }> {
        const redisKey = `cet4:page:${page}:${pageSize}`;
        const cached = await this.redis.get(redisKey);
        if (cached) {
            return JSON.parse(cached);
        }

        const [list, total] = await this.cet4Repository.findAndCount({ skip: (page - 1) * pageSize, take: pageSize });
        await this.redis.set(redisKey, JSON.stringify({ list, total }));
        return { list, total }; 
    }
}
