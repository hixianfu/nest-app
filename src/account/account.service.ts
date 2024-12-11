import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from './schemas/account.entity';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(AccountEntity)
        private readonly accountRepository: Repository<AccountEntity>
    ) {}

    async create(account: any): Promise<any> {
        return await this.accountRepository.save(account);
    }

    async findAll(): Promise<AccountEntity[]> {
        return await this.accountRepository.find();
    }

    
    // 根据用户ID查找账户
    async findByUserId(userId: number): Promise<AccountEntity | null> {
        const account = await this.accountRepository.findOne({ where: { user: { id: userId } } });

        if(!account) {
            throw new NotFoundException('账户不存在');
        }

        return account;
    }
    
    /**
     * 转账
     */
    async transfer(fromUserId: number, toUserId: number, amount: number): Promise<{ fromAccount: AccountEntity, toAccount: AccountEntity }> {
        const queryRunner = this.accountRepository.manager.connection.createQueryRunner();
        
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const fromAccount = await this.findByUserId(fromUserId);
            const toAccount = await this.findByUserId(toUserId);

            if(!fromAccount || !toAccount) {
                throw new NotFoundException('账户不存在');
            }

            if(fromAccount.balance < amount) {
                throw new BadRequestException('余额不足');
            }

            fromAccount.balance -= amount;
            toAccount.balance += amount;

            await queryRunner.manager.save(fromAccount);
            await queryRunner.commitTransaction();

            await queryRunner.manager.save(toAccount);
            
            return { fromAccount, toAccount };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}   
