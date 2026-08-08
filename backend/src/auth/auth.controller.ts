import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('guest')
  async guest() {
    return this.authService.loginAsGuest();
  }

  // Requires GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET to be set in .env
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // redirects to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req, @Res() res: Response) {
    const { accessToken } = await this.authService.loginWithGoogleProfile(
      req.user,
    );
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/login/callback?token=${accessToken}`);
  }
}
