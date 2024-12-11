import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TransferDto } from './schemas/transfer.dto';
import { AccountEntity } from './schemas/account.entity';

@Controller('account')
@ApiTags('账户')
export class AccountController {
    constructor(private readonly accountService: AccountService) { }

    @Post()
    @ApiBody({ type: AccountEntity })
    create(@Body() account: any) {
        return this.accountService.create(account);
    }

    @Get()
    findAll() {
        return this.accountService.findAll();
    }

    @Get(':userId')
    findByUserId(@Param('userId') userId: number) {
        return this.accountService.findByUserId(userId);
    }

    @Post('transfer')
    @ApiOperation({ summary: '转账' })
    @ApiBody({ description: '转账信息', type: TransferDto })
    transfer(@Body() body: TransferDto) {
        return this.accountService.transfer(body.fromUserId, body.toUserId, body.amount);
    }
}
