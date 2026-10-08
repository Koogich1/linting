import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

export const orders = pgTable('orders', {
	id: uuid('id').primaryKey(),
	customerId: uuid('customer_id').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});
