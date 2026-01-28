import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ProviderEnum } from '@prisma/client';
import { Request } from 'express';
import { Strategy, Profile } from 'passport-github';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GITHUB_SECRET'),
      callbackURL: configService.getOrThrow<string>('GITHUB_CALLBACK_URL'),
      scope: ['read:user', 'user:email'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any) => void,
  ) {
    try {
      const user = {
        firstName: profile.displayName,
        email: profile.emails?.[0]?.value,
        provider: ProviderEnum.GITHUB,
        mode: req.query.state,
      };
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }
}
