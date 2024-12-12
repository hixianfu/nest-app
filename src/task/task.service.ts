import { Cron } from "@nestjs/schedule";
import { CronExpression } from "@nestjs/schedule";
import { UsersService } from "src/users/users.service";
import { SchedulerRegistry } from "@nestjs/schedule";
import { forwardRef } from "@nestjs/common";
import { Inject } from "@nestjs/common";
import { MoreThan } from "typeorm";
import { MailService } from "src/mail/mail.service";

export class TaskService {
    constructor(private schedulerRegistry: SchedulerRegistry,
        @Inject(forwardRef(() => UsersService))  private userService: UsersService,
        @Inject(forwardRef(() => MailService))  private mailService: MailService
    ){}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleCron() {
        const today = new Date();

        const users = await this.userService.findByCondition({
            createdAt: MoreThan(today)
        });
        
        users.map(async user => {
            await this.mailService.sendBirthdayEmail(user);
        })
    }
}
