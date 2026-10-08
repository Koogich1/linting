import { IsEmail } from 'class-validator';

export class CreateUserDto {
	@IsEmail({}, { message: 'Invalid email address' })
	email: string;
}
