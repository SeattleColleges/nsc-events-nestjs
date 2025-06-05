import { Controller, Get, Query, Res, HttpStatus } from '@nestjs/common';
import { GoogleAuthService } from '../services/google-calendar.service';
import { Response } from 'express';
import { jwtDecode } from 'jwt-decode';

@Controller('google-auth')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Get('login')
  googleLogin(@Res() res: Response): void {
    const authUrl = this.googleAuthService.getAuthUrl();
    res.redirect(authUrl);
  }

  @Get('callback')
  async googleCallback(
    @Query('code') code: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      // 1) Exchange the authorization code for tokens
      const tokens = await this.googleAuthService.getCallback(code);
      //    tokens now contains { access_token, refresh_token, expiry_date, id_token, scope, token_type }

      // 2) Decode the ID token (JWT) to extract email (and Google user ID)
      const payload = jwtDecode<{ email: string; sub: string }>(
        tokens.id_token,
      );
      const email = payload.email;
      const googleId = payload.sub;

      // 3) Call setCredentials with the full token object (including email + googleId)
      await this.googleAuthService.setCredentials({
        ...tokens,
        email,
        googleId,
      });

      // 4) Send success response
      res
        .status(HttpStatus.OK)
        .send('Authentication successful! You can close this window.');
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Failed to process Google authentication',
        error: error.message,
      });
    }
  }
}
