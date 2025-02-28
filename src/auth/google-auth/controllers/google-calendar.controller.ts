import { Controller, Get, Query, Res, Req, HttpStatus } from '@nestjs/common';
import { GoogleAuthService } from '../services/google-calendar.service';
import { Response } from 'express';

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
      // Exchange code for token
      const tokens = await this.googleAuthService.getTokensFromCode(code);

      // Immediately use the token to fetch calendar data
      const calendarData = await this.googleAuthService.getCalendarData(
        tokens.access_token,
      );

      // Return the data directly as a downloadable file
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=calendar-data.json',
      );
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(calendarData, null, 2));
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Failed to process Google authentication',
        error: error.message,
      });
    }
  }
}
