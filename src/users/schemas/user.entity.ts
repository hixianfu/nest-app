import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Department } from 'src/dept/schemas/dept.entity';

@Entity('users')
export class User {

  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '用户ID', example: 1 })
  id: number;

  @Column()
  @ApiProperty({ description: '用户名', example: '张三' })
  name: string;

  @Column()
  @ApiProperty({ description: '密码', example: '123456' })
  password: string;

  @Column()
  @ApiProperty({ description: '邮箱', example: '123456@qq.com' })
  email: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '年龄', example: 18 })
  age: number;

  @CreateDateColumn()
  @ApiProperty({ description: '创建时间', example: '2021-01-01 00:00:00' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: '更新时间', example: '2021-01-01 00:00:00' })
  updatedAt: Date;

  @Column({ nullable: true })
  @ApiProperty({ description: '工号', example: '000000' })
  workNumber: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '性别', example: '男' })
  gender: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '地址', example: '北京市海淀区' })
  address: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '城市', example: '北京市' })
  city: string;

  @Column({ default: 1 })
  @ManyToOne(() => Department)
  @JoinColumn({ name: 'dept_id' })
  @ApiProperty({ description: '部门ID', example: 1 })
  dept_id: number;

  @Column({ nullable: true })
  @ApiProperty({ description: '头像', example: 'https://example.com/avatar.png' })
  avatar: string;

  @Column({ select: false, nullable: true })
  @ApiProperty({ description: '年龄大于', example: 18 })
  age_gt: number;
}

