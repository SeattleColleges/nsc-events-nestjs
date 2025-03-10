import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleAuthService {
  private oauth2Client: OAuth2Client;

  constructor(private configService: ConfigService) {
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
      this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
      this.configService.get<string>('GOOGLE_REDIRECT_URI'),
    );
  }

  getAuthUrl(): string {
    const scopes = ['https://www.googleapis.com/auth/calendar.readonly'];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
    });
  }

  async getTokensFromCode(code: string): Promise<any> {
    const { tokens } = await this.oauth2Client.getToken(code);
    return tokens;
  }

  async getCalendarData(accessToken: string): Promise<any> {
    // Set the access token on the OAuth client
    this.oauth2Client.setCredentials({ access_token: accessToken });

    // Create a Calendar client
    const calendar = google.calendar({
      version: 'v3',
      auth: this.oauth2Client,
    });

    // Get list of calendar events
    const events = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return events.data;
  }
}
