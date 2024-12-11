import { Controller, Get, Post, Body } from "@nestjs/common";
import { DeptService } from "./dept.service";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { Department } from "./schemas/dept.entity";
import { ApiOperation } from "@nestjs/swagger";

@Controller('dept')
@ApiTags('部门')
export class DeptController {
    constructor(private readonly deptService: DeptService) {}

    @Post()
    @ApiOperation({ summary: '创建部门' })
    @ApiBody({ type: Department })
    create(@Body() dept: Department): Promise<Department> {
        return this.deptService.create(dept);
    }

    @Get()
    @ApiOperation({ summary: '获取所有部门' })
    findAll(): Promise<Department[]> {
        return this.deptService.findAll();
    }
}