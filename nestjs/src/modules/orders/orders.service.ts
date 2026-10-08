import { ConflictException, Injectable } from '@nestjs/common';

import { ErrorCode } from '../../errors';

@Injectable()
export class OrdersService {
	create(exists: boolean): void {
		if (exists) {
			throw new ConflictException(ErrorCode.OrderExists);
		}
	}
}
