import { Controller, Get, Query, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

interface CasdoorTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

interface DecodedToken {
  owner: string;
  name: string;
  createdTime: string;
  updatedTime: string;
  id: string;
  type: string;
  password: string;
  displayName: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  countryCode: string;
  region: string;
  affiliation: string;
  title: string;
  score: number;
  karma: number;
  ranking: number;
  isAdmin: boolean;
  isForbidden: boolean;
  isDeleted: boolean;
  tokenType: string;
  tag: string;
  scope: string;
  azp: string;
  iss: string;
  sub: string;
  aud: string[];
  exp: number;
  nbf: number;
  iat: number;
  jti: string;
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

      if (data.access_token) {
        res.cookie('token', data.access_token, {
          httpOnly: false,
          secure: false,
          sameSite: 'lax',
        });

        res.redirect('https://localhost:3001/callback');
      } else {
        res.status(400).send('Token exchange failed');
      }
    } catch (error) {
      res.status(500).send('Callback error');
    }
  }

  @Get('profile')
  getProfile(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies['token'];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
      const decoded = jwt.decode(token) as DecodedToken;

      if (!decoded) {
        return res.status(400).json({ error: 'Invalid token' });
      }

      const { name, displayName, email, avatar, isAdmin } = decoded;

      return res.json({ name, displayName, email, avatar, isAdmin });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to decode token' });
    }
  }
}
