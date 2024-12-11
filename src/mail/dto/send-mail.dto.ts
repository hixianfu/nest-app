import { ApiProperty } from "@nestjs/swagger";

export class SendMailDto {
  @ApiProperty({ description: '收件人邮箱' })
  to: string;
  
  @ApiProperty({ description: '类型', example: 'register' })
  type: 'register' | 'reset';
}       