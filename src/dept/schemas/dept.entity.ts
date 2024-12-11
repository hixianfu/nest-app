import { Column, Entity } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { PrimaryGeneratedColumn } from "typeorm";

@Entity('dept')
export class Department {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: '部门ID', example: 1 })
    id: number;

    @Column()
    @ApiProperty({ description: '部门名称', example: '研发部' })
    name: string;
}
