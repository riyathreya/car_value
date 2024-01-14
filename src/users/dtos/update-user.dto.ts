import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional() // both are optional as any one opf the fields or both fields updation is to be allowed
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}
