import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/libs/common/src/decorators';
import {
  LoginInDto,
  ProviderModeDTO,
  RefreshTokenDto,
  RegisterLocalUserDto,
  UserProviderDTO,
} from './dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { CreateAuthGuard } from './guards';
import { extractBearerToken } from 'src/libs/common/src/utils';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  registerLocal(@Body() dto: RegisterLocalUserDto) {
    return this.authService.registerLocal(dto);
  }

  @Post('login-local')
  @Public()
  loginLocal(
    @Body() dto: LoginInDto,
    @Headers('user-agent') userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logInLocal(dto, userAgent, res);
  }

  @Post('refresh-token')
  @Public()
  refreshToken(
    @Body() dto: RefreshTokenDto,
    @Headers('user-agent') userAgent: string,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }
    return this.authService.refreshToken(res, userAgent, dto.userId, refreshToken);
  }

  @Delete('logOut/:id')
  logOut(
    @Param('id', new ParseUUIDPipe()) userId: string,
    @Res({ passthrough: true }) res: Response,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.authService.logOut(userId, res, userAgent);
  }

  @Get('google')
  @Public()
  @UseGuards(CreateAuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @Public()
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: Request,
    @Headers('user-agent') userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const dto = req.user as UserProviderDTO;
    const googleAuth = await this.authService.registerOrLoginWithProviders(
      dto,
      userAgent,
      res,
      dto.provider,
    );
    res.redirect(
      `http://localhost:3002/auth-success?token=${extractBearerToken(
        googleAuth.tokens.access_token,
      )}`,
    );
  }

  @Get('git')
  @Public()
  @UseGuards(CreateAuthGuard('github'))
  async gitAuth() {}

  @Get('git/callback')
  @Public()
  @UseGuards(AuthGuard('github'))
  async gitAuthRedirect(
    @Req() req: Request,
    @Headers('user-agent') userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const dto = req.user as UserProviderDTO;
    const gitAuth = await this.authService.registerOrLoginWithProviders(
      dto,
      userAgent,
      res,
      dto.provider,
    );
    res.redirect(
      `http://localhost:3002/auth-success?token=${extractBearerToken(gitAuth.tokens.access_token)}`,
    );
  }
}
