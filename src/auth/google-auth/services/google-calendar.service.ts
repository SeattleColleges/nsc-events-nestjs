/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { get } from 'http';
import { User } from 'src/auth/schemas/userAuthSchema';
import { UserService } from 'src/user/services/user/user.service';

@Injectable()
export class GoogleAuthService {
  private oauth2Client: OAuth2Client;
  private readonly userService: UserService;

  constructor(private configService: ConfigService) {
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
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
    });
    return authUrl;
  }

  async getCallback(code: string): Promise<any> {
    // Exchange the authorization code for tokens
    return new Promise((resolve, reject) => {
      this.oauth2Client.getToken(code, (err, tokens) => {
        if (err) {
          reject(err);
        } else {
          this.oauth2Client.setCredentials(tokens);
          resolve(tokens);
        }
      });
    });
  }
  setCredentials(tokens: any): void {
    // Set the credentials for the OAuth2 client
    this.oauth2Client.setCredentials(tokens);
    // Store tokens in the user database object
    this.userService.getUserByEmail(tokens.email).then((user: User) => {
      if (user) {
        user.googleTokens = tokens;
        this.userService.updateUser(user).then(() => {
          console.log('User tokens updated successfully');
        });
      } else {
        console.log('User not found');
      }
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
