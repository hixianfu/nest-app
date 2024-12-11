import { ApiProperty } from "@nestjs/swagger";

export class RegisterDTO {
    @ApiProperty({ description: '邮箱', example: 'test@example.com' })
    email: string;

    @ApiProperty({ description: '密码', example: '123456' })
    password: string;

    @ApiProperty({ description: '验证码', example: '123456' })
    code: string;
}