import { Transform } from 'class-transformer';

export class UpdateUserDto {
	@Transform(({ value }) => value === true)
	active: boolean;
}
