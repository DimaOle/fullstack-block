import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SongService } from './song.service';
import { SongController } from './song.controller';

@Module({
  providers: [SongService],
  controllers: [SongController],
  imports: [PrismaModule],
})
export class SongModule {}
