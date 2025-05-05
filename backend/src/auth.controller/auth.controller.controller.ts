process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';

interface CasdoorTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

@Controller('auth/casdoor')
export class AuthController {
  private readonly clientId = '559e37c6271af97b3566';
  private readonly clientSecret = '6bc0e212488d1f66a4035d44edc883cf32335c2e';
  private readonly redirectUri = 'https://localhost:3000/auth/casdoor/callback';
  private readonly casdoorTokenUrl =
    'https://localhost:8443/api/login/oauth/access_token';

  @Get('callback')
  async casdoorCallback(@Query('code') code: string, @Res() res: Response) {
    try {
      const response = await axios.post(
        this.casdoorTokenUrl,
        {
          grant_type: 'authorization_code',
          code,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri: this.redirectUri,
        },
        { headers: { 'Content-Type': 'application/json' } },
      );

      const data: CasdoorTokenResponse = response.data;

      console.log(JSON.stringify(data));

      if (data.access_token) {
        res.redirect(
          `https://localhost:3001/callback?token=${data.access_token}`,
        );
      } else {
        res.status(400).send('Token exchange failed');
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
}
