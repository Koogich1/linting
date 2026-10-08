import { Module } from '@nestjs/common';

import { AuditService } from './audit.service';
import { MailService } from './mail.service';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';

@Module({
	providers: [
		OrdersService,
		OrdersRepository,
		MailService,
		AuditService,
	],
})
export class OrdersModule {}
