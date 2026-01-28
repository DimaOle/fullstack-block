import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthGuard, RolesGuard } from './libs/common/src/guards';
import { APP_GUARD } from '@nestjs/core';
import { SongModule } from './song/song.module';
import { TagModule } from './tag/tag.module';
import { ReviewModule } from './review/review.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: `.env.${process.env.NODE_ENV}` }),
    PrismaModule,
    AuthModule,
    SongModule,
    UserModule,
    TagModule,
    ReviewModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
