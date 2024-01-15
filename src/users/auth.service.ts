import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

// scrypt works with callbacks,
// this allows to return a fulfilled promise
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // check if email is already in use
    const users = await this.usersService.find(email);

    if (users?.length) {
      throw new BadRequestException('Email in Use!');
    }

    // hash users password
    // generate salt
    const salt = randomBytes(8).toString('hex');

    // hash passowrd + salt together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // join hashed result and salt together and store in DB
    const result = salt + '.' + hash.toString('hex');

    // create a new user and save
    const user = await this.usersService.create(email, result);

    // return user
    return user;
  }

  async signin(email: string, password: string) {
    // get user
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    // compare passowords
    const storedPassword = user.password;

    // extract salt and hash using input pasword
    const [salt, storedHash] = storedPassword.split('.');

    // hash passowrd + salt together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // join hashed result and salt together and store in DB
    const hashedPassword = hash.toString('hex');

    if (hashedPassword !== storedHash) {
      throw new BadRequestException('Invalid credentials');
    }

    return user;
  }
}
