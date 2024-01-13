import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    this.repo.save(user);
  }

  /**
   * Finds one record that matches given criteria
   * @param id
   * @returns
   */
  async findOne(id: number) {
    const user = await this.repo.findOneBy({ id }); // {email} whatever criteria
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return user;
  }

  /**
   * Return users basis email
   * @param email
   * @returns
   */
  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  /**
   * Update user
   * @param id
   * @param attrs
   * @returns
   */
  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  /**
   * Delete user
   * @param id
   * @returns
   */
  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    // this.repo.delete(id); delete does not internally call hooks. so using remove by passing user entity
    return this.repo.remove(user);
  }
}
