import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './schemas/account.entity';

@Module({
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService, TypeOrmModule], 
  imports: [TypeOrmModule.forFeature([AccountEntity])]
})
export class AccountModule {}
