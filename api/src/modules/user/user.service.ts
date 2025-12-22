import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemUser } from 'src/database/entities';
import { Repository } from 'typeorm';
import { UserItem } from './types/user';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(SystemUser)
    private readonly userRepository: Repository<SystemUser>,
  ) {}

  async getUserDetail(id: string): Promise<UserItem> {
    const response = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'role', 'phone', 'profileUrl'],
    });

    if (!response) throw new BadRequestException('User not found');

    const data: UserItem = {
      id: response.id,
      username: response.username,
      email: response.email ?? '',
      role: response.role,
      phone: response.phone ?? '',
      profileUrl: response.profileUrl ?? '',
    };

    return data;
  }
}
