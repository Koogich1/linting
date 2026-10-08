import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { db } from '../../db';

import { orders } from './schemas/orders.schema';

@Injectable()
export class OrdersRepository {
	async findOne(id: string): Promise<unknown> {
		const rows = await db.select().from(orders).where(eq(orders.id, id));
		return rows[0];
	}
}
