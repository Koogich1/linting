import { Injectable } from '@nestjs/common';

import { db } from '../../db';

@Injectable()
export class UsersRepository {
	async findOne(id: string): Promise<unknown> {
		const data = await db.query.users.findFirst({ where: { id } });
		return data;
	}
}
