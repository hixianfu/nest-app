import { Controller, Get, Param, Post, Body, Query, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.entity';
import { FindOptionsWhere, UpdateResult } from 'typeorm';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RegisterDTO } from './dto/register.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('users')
@ApiTags('用户')
@ApiBearerAuth('Authorization')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @ApiOperation({ summary: '获取所有用户' })
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get('page')
    @ApiOperation({ summary: '分页查询用户' })
    @ApiQuery({ name: 'page', description: '页码', required: true })
    @ApiQuery({ name: 'pageSize', description: '每页条数', required: true })
    findByPage(@Query('page') page: number, @Query('pageSize') pageSize: number): Promise<{ list: User[], total: number }> {
        return this.usersService.findByPage(page, pageSize);
    }

    @Get('search')
    @ApiOperation({ summary: '根据条件查询用户' })
    @ApiQuery({ name: 'condition', description: '查询条件', type: User })
    findByCondition(@Query() condition: FindOptionsWhere<User>): Promise<User[]> {
        return this.usersService.findByCondition(condition);
    }

    @Put('reset')
    @ApiOperation({ summary: '重置密码' })
    @ApiBody({ type: RegisterDTO })
    reset(@Body() user: RegisterDTO): Promise<null> {
        console.log(user, 'user1');
        return this.usersService.reset(user);
    }

    @Post()
    @ApiOperation({ summary: '创建用户' })
    create(@Body() user: User): Promise<User> {
        return this.usersService.create(user);
    }

    @Post('register')
    @ApiOperation({ summary: '注册' })
    @ApiBody({ type: User })
    register(@Body() user: User & { code: string }): Promise<User> {
        return this.usersService.register(user);
    }

    @Put(':id')
    @ApiOperation({ summary: '更新用户信息' })
    @ApiParam({ name: 'id', description: '用户ID', required: true })
    @ApiBody({ type: User })
    update(@Body() updateData: Partial<User>, @Param('id') userId: number): Promise<UpdateResult> {
        return this.usersService.updateByCondition(updateData, userId);
    }

    @Get(':id')
    @ApiOperation({ summary: '根据ID查询用户' })
    @ApiParam({ name: 'id', description: '用户ID', required: true })
    findById(@Param('id') id: number): Promise<User | null> {
        return this.usersService.findById(id);
    }
}
