import { Module } from '@nestjs/common';
import { User } from './schemas/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
    imports: [TypeOrmModule.forFeature([User]), ThrottlerModule.forRoot([{ ttl: 60000, limit: 3 }])],
    providers: [UsersService],
    exports: [UsersService, TypeOrmModule],
    controllers: [UsersController],
})
export class UsersModule {}
