import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  sign(userId: string) {
    return this.jwtService.sign({ sub: userId });
  }

  async loginAsGuest() {
    const user = await this.usersService.createGuest();
    return { user, accessToken: this.sign(user.id) };
  }

  async loginWithGoogleProfile(profile: {
    googleId: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
  }) {
    let user = await this.usersService.findByGoogleId(profile.googleId);
    if (!user) {
      user = await this.usersService.createFromGoogle(profile);
    }
    return { user, accessToken: this.sign(user.id) };
  }
}
