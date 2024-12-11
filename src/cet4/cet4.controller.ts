import { Get, Controller, Query, Param } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiQuery } from "@nestjs/swagger";
import { Cet4Service } from "./cet4.service";
import { Cet4 } from "./schemas/cet4.entity";

@Controller('cet4')
export class Cet4Controller {
    constructor(private readonly cet4Service: Cet4Service) {}   


    @Get('page')
    @ApiOperation({ summary: '分页查询单词' })
    @ApiQuery({ name: 'page', description: '页码', example: 1 })
    @ApiQuery({ name: 'pageSize', description: '每页条数', example: 10 })
    async findByPage(@Query('page') page: number, @Query('pageSize') pageSize: number): Promise<{ list: Cet4[], total: number }> {
        console.log(page, pageSize);
        return this.cet4Service.findByPage(page, pageSize);
    }

    @Get(':id')
    @ApiOperation({ summary: '根据ID查询单词' })
    @ApiParam({ name: 'id', description: '单词ID', example: 1 })
    async findOne(@Param('id') id: number): Promise<Cet4 | null> {
        return this.cet4Service.findOne(id);
    }
}
