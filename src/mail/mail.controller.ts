import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SendMailDto } from './dto/send-mail.dto';

@Controller('mail')
@ApiTags('邮件')
export class MailController {
  constructor(private readonly mailService: MailService) { }

  @Post('send')
  @ApiOperation({ summary: '发送邮件' })
  @ApiBody({ type: SendMailDto })
  async sendMail(@Body() body: SendMailDto) {
    return this.mailService.sendVerificationCode(body.to, body.type);
  }
}
