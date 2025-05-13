/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { get } from 'http';

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

  // Authentication
  getAuthUrl(): string {
    // TODO
    return '';
  }

  async getCallback(code: string): Promise<any> {
    // TODO
  }
  getTokensFromCode(code: string): Promise<any> {
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
