import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { LoginInDto, RegisterLocalUserDto, UserProviderDTO } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { CreateUser, PayloadRefreshToken } from './interfaces';
import { UserService } from 'src/user/user.service';
import { CookieService } from './cookie.service';
import { Response } from 'express';
import { ProviderEnum, RoleEnum } from '@prisma/client';
import { ProviderMode } from './enums';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ms = require('ms');
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private configServise: ConfigService,
    private userService: UserService,
    private jwtService: JwtService,
    private cookieService: CookieService,
  ) {}
  async registerLocal(dto: RegisterLocalUserDto): Promise<CreateUser> {
    const findUser = await this.userService.getUserByEmail(dto.email);

    if (findUser) {
      throw new BadRequestException('try another email');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const craeteUser = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
        provider: 'LOCAL',
        role: ['USER'],
        updateAt: new Date(),
      },
      select: { id: true, firstName: true, lastName: true, email: true, createdAt: true },
    });

    if (!craeteUser) {
      throw new InternalServerErrorException('Database error');
    }

    return craeteUser;
  }

  async registerOrLoginWithProviders(
    dto: UserProviderDTO,
    userAgent: string,
    res: Response,
    provider: ProviderEnum,
  ): Promise<CreateUser> {
    if (!dto.email) {
      throw new UnprocessableEntityException('no found email');
    }
    let user = await this.prisma.user.findFirst({ where: { email: dto.email } });

    if (!user) {
      const password = 'registrationByProvider';
      const hashedPassword = await bcrypt.hash(password, 10);
      const { mode, ...dataToSave } = dto;
      user = await this.prisma.user.create({
        data: {
          ...dataToSave,
          password: hashedPassword,
          provider: provider,
          role: ['USER'],
          updateAt: new Date(),
        },
      });
      if (!user) {
        throw new InternalServerErrorException();
      }
    }
    await this.createRefreshToken(user.id, userAgent, res);
    const token = await this.createJwtToken(user.email, user.password, user.role, user.id);
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
      tokens: token,
    };
  }

  async logInLocal(dto: LoginInDto, userAgent: string, res: Response) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordIsMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordIsMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }
    await this.createRefreshToken(user.id, userAgent, res);
    return this.createJwtToken(dto.email, user.password, user.role, user.id);
  }

  async refreshToken(
    res: Response,
    userAgent: string,
    userId: string,
    refreshToken: string,
  ): Promise<{ access_token: string }> {
    try {
      const token = await this.prisma.token.findFirst({
        where: { token: refreshToken },
        include: {
          user: {
            select: {
              email: true,
              password: true,
              role: true,
            },
          },
        },
      });
      if (!token) {
        throw new UnauthorizedException('refreToken expired');
      }

      if (new Date() > token.exp) {
        throw new UnauthorizedException('refreToken expired');
      }

      await this.createRefreshToken(userId, userAgent, res);

      return this.createJwtToken(token.user.email, token.user.password, token.user.role, userId);
    } catch (e) {
      console.log(`Prisma: ${e}`);
      throw new InternalServerErrorException('Database error');
    }
  }

  async logOut(userId: string, res: Response, userAgent: string): Promise<{ logOut: boolean }> {
    await this.cookieService.cleanRefreshToken(res);
    const user = await this.prisma.token.deleteMany({
      where: { userId, userAgent },
    });
    if (user.count === 0) {
      throw new NotFoundException("Token don't found");
    }

    return { logOut: true };
  }

  private async createJwtToken(
    email: string,
    password: string,
    role: RoleEnum[],
    userId: string,
  ): Promise<{ access_token: string }> {
    const payload = { user: email, pas: password, role: role, userId: userId };
    const token = await this.jwtService.signAsync(payload);
    return {
      access_token: `Bearer ${token}`,
    };
  }

  private async createRefreshToken(
    userId: string,
    userAgent: string,
    res: Response,
  ): Promise<PayloadRefreshToken> {
    const uuidV4 = uuidv4();
    const refreshExp = this.configServise.get<string>('REFRESH_EXP');
    const expDate = new Date(Date.now() + ms(refreshExp));

    const refreshToken = await this.prisma.token.upsert({
      where: {
        userId_userAgent: { userId, userAgent },
      },
      update: {
        token: uuidV4,
        exp: expDate,
      },
      create: {
        token: uuidV4,
        exp: expDate,
        userAgent,
        userId,
      },
      select: {
        token: true,
        exp: true,
      },
    });

    this.cookieService.setRefreshToken(res, refreshToken.token);
    return refreshToken;
  }
}
