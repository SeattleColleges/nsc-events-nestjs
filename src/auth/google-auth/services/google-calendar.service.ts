/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { UserService } from 'src/user/services/user/user.service';

@Injectable()
export class GoogleAuthService {
  private oauth2Client: OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
      this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
      this.configService.get<string>('GOOGLE_REDIRECT_URI'),
    );
  }

  // Authentication
  getAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ];
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
    });
  }

  async getCallback(code: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.oauth2Client.getToken(code, (err, tokens) => {
        if (err) {
          reject(err);
        } else {
          console.log('Google tokens received:', tokens);
          this.oauth2Client.setCredentials(tokens);
          resolve(tokens);
        }
      });
    });
  }

  async setCredentials(tokens: any) {
    this.oauth2Client.setCredentials(tokens);
    console.log('OAuth2 client credentials set:', tokens);

    const updatedFields = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiryDate: tokens.expiry_date,
      idToken: tokens.id_token,
      scope: tokens.scope,
      tokenType: tokens.token_type,
      googleId: tokens.googleId,
    };
    console.log('Updated fields:', updatedFields);

    await this.userService.updateGoogleCredentialsByEmail(tokens.email, {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      idToken: tokens.id_token,
      expiryDate: tokens.expiry_date,
    });
  }
  // Token management
  async refreshToken(refreshToken: string): Promise<any> {
    // TODO
  }
  async validateToken(accessToken: string): Promise<boolean> {
    // Check if a token is valid and not expired
    return true;
  }

  // User data
  async getUserProfile(accessToken: string): Promise<any> {
    // Get Google user profile information
  }

  // Calendar data retrieval
  async getCalendarData(accessToken: string): Promise<any> {
    // Get upcoming calendar events from the user's calendar
  }

  // Calendar sync
  async syncCalendarEvents(accessToken: string): Promise<any> {
    // Sync calendar events using Google's sync tokens
  }

  // Push notifications
  async setupPushNotifications(
    accessToken: string,
    channelId: string,
    webhookUrl: string,
  ): Promise<any> {
    // Setup Google webhook notifications for calendar changes
  }

  // Batch operations
  async batchGetEvents(
    accessToken: string,
    eventIds: string[],
  ): Promise<any[]> {
    // Get multiple events in a single batch
    return Promise.resolve([]);
  }
}
