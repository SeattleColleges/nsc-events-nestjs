import { Controller, Get, Query, Res, Req, HttpStatus, UseGuards } from '@nestjs/common';
import { GoogleAuthService } from '../services/google-calendar.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/auth/schemas/userAuth.model';
import { Model } from 'mongoose';
import { Request } from 'express';

@Controller('google-auth')
export class GoogleAuthController {
  constructor(
    private readonly googleAuthService: GoogleAuthService, 
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  @Get('login')
  googleLogin(@Res() res: Response): void {
    const authUrl = this.googleAuthService.getAuthUrl();
    res.redirect(authUrl);
  }

  @Get('callback')
  @UseGuards(AuthGuard('jwt')) // Ensure the user is authenticated before proceeding
  async googleCallback(
    @Query('code') code: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<void> {
    try {
      console.log("unauthorized?")
      console.log("req.user: ", req.user);

      // Exchange code for token
      const tokens = await this.googleAuthService.getTokensFromCode(code);
      console.log("tokens: ", tokens);

      console.log("req.user: ", req.user);

      // Save the tokens to the current authenticated user
      const userId = (req.user as any)._id; 
      await this.userModel.findByIdAndUpdate(userId, {
        googleCredentials: tokens,
      });

      // Immediately use the token to fetch calendar data
      const calendarData = await this.googleAuthService.getCalendarData(
        tokens.access_token,
      );

      // Remove console log in production
      // console.log('calendarData: ', calendarData);

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
