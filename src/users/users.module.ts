import { Module } from '@nestjs/common';
import { User } from './schemas/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
@Module({
    imports: [TypeOrmModule.forFeature([User]) ],
    providers: [UsersService],
    exports: [UsersService, TypeOrmModule],
    controllers: [UsersController],
})
export class UsersModule {}
