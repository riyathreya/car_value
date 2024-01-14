// this user DTO is used in interceptors
import { Expose } from 'class-transformer';
export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;
}
