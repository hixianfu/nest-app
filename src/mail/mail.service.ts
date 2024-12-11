import { InjectRedis } from '@nestjs-modules/ioredis';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import * as nodemailer from 'nodemailer';
import generateCode from 'src/common/utils/generateCode';
import { UsersService } from 'src/users/users.service';
import * as mjml2html from 'mjml';

@Injectable()
export class MailService {
    private readonly transporter: nodemailer.Transporter;

    constructor(
        @InjectRedis() private redis: Redis,
        private readonly usersService: UsersService
    ) {
        this.transporter = nodemailer.createTransport({
            service: 'qq',
            port: process.env.MAIL_PORT || 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }

    /**
     * 发送验证码
     * @param to 
     * @returns 
     */
    async sendVerificationCode(to: string, type: 'register' | 'reset'): Promise<void> {
        const user = await this.usersService.findByCondition({ email: to });

        if (user.length > 0 && type === 'register') {
            throw new BadRequestException('用户已存在');
        }

        if (await this.redis.get(to)) {
            throw new BadRequestException('验证码已发送, 请注意查收');
        }

        const code = generateCode();
        const mjml = this.generateVerificationEmailHtml(code, type);
        const { html } = mjml2html(mjml);

        const mailOptions: nodemailer.SendMailOptions = {
            from: process.env.MAIL_USER,
            to,
            subject: type === 'register' ? '注册验证码' : '重置密码验证码',
            html
        }

        try {
            await this.transporter.sendMail(mailOptions);

            await this.redis.set(to, code, 'EX', 15 * 60);
        } catch (error) {
            console.error('发送邮件失败', error);
            throw new Error('发送邮件失败');
        }
    }

    private generateVerificationEmailHtml(code: string, type: 'register' | 'reset') {
        return `
        <mjml>
            <mj-body>
                <mj-section>
                    <mj-column>

                        <mj-image width="100px" src="https://xianfu-1321684111.cos.ap-guangzhou.myqcloud.com/image/1733723058900-vite.svg"></mj-image>

                        <mj-divider border-color="#F45E43"></mj-divider>

                        <mj-text font-size="20px" color="#F45E43" font-family="helvetica">
                            ${type === 'register' ? '您的注册验证码是：' : '您的重置密码验证码是：'}<span style="font-size: 20px; color: #007bff;">${code}</span>,请在15分钟内使用。
                        </mj-text>
                    
                        <mj-button href="">Verify Your Email</mj-button>
                    </mj-column>
                </mj-section>
            </mj-body>
        </mjml>
        `
    }
}

