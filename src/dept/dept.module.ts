import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Department } from "./schemas/dept.entity";
import { DeptController } from "./dept.controller";
import { DeptService } from "./dept.service";

@Module({
    imports: [TypeOrmModule.forFeature([Department])],
    controllers: [DeptController],
    providers: [DeptService],
})
export class DeptModule {}  