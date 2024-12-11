import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({ description: '用户名', example: '廖超栋' })
    name: string;
    @ApiProperty({ description: '密码', example: '123' })
    password: string;
}
