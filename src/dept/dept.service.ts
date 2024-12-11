import { Injectable } from "@nestjs/common";
import { Department } from "./schemas/dept.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";


@Injectable()
export class DeptService {
    constructor(
        @InjectRepository(Department)
        private deptRepository: Repository<Department>,
    ) {}

    async create(dept: Department): Promise<Department> {
        return this.deptRepository.save(dept);
    }

    async findAll(): Promise<Department[]> {
        return this.deptRepository.find();
    }
}

