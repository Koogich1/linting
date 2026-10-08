import { Module } from '@nestjs/common';

import { AuditService } from './audit.service';
import { MailService } from './mail.service';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
	providers: [UsersService, UsersRepository, MailService, AuditService],
})
export class UsersModule {}
