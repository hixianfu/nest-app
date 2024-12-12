import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { RedisCacheModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { Cet4Module } from './cet4/cet4.module';
import { DeptModule } from './dept/dept.module';
import { AccountModule } from './account/account.module';
import { UploadModule } from './upload/upload.module';
import { MailModule } from './mail/mail.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './task/task.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.development', '.env.production']
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      database: process.env.DB_DATABASE,
      dateStrings: ['Date'],
      synchronize: true,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60,
        limit: 3
      }
    ]),
    ScheduleModule.forRoot(),
    UsersModule,
    RedisCacheModule,
    AuthModule,
    DeptModule,
    Cet4Module,
    AccountModule,
    UploadModule,
    MailModule
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService, TaskService],
})
export class AppModule {}
