import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
	create(exists: boolean): void {
		if (exists) {
			throw new ConflictException('User already exists');
		}
	}
}
