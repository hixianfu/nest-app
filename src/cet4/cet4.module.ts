import { TypeOrmModule } from "@nestjs/typeorm";
import { Cet4 } from "./schemas/cet4.entity";
import { Module } from "@nestjs/common";
import { Cet4Controller } from "./cet4.controller";
import { Cet4Service } from "./cet4.service";


@Module({
    imports: [TypeOrmModule.forFeature([Cet4])],
    providers: [Cet4Service],
    exports: [Cet4Service, TypeOrmModule],
    controllers: [Cet4Controller],
})
export class Cet4Module {}          
