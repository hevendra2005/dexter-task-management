import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  findById(id: string) {
    return this.usersRepo.findOne({ where: { id } });
  }

  findByGoogleId(googleId: string) {
    return this.usersRepo.findOne({ where: { googleId } });
  }

  async createGuest() {
    const guestNumber = Math.floor(Math.random() * 9000) + 1000;
    const user = this.usersRepo.create({
      fullName: `Guest ${guestNumber}`,
      username: `guest${guestNumber}`,
      isGuest: true,
    });
    return this.usersRepo.save(user);
  }

  async createFromGoogle(profile: {
    googleId: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
  }) {
    const user = this.usersRepo.create({
      googleId: profile.googleId,
      email: profile.email,
      fullName: profile.fullName,
      username: profile.email ? profile.email.split('@')[0] : undefined,
      avatarUrl: profile.avatarUrl,
      isGuest: false,
    });
    return this.usersRepo.save(user);
  }

  async update(id: string, data: Partial<User>) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    Object.assign(user, data);
    return this.usersRepo.save(user);
  }
}
