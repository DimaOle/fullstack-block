import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [TagService],
  controllers: [TagController],
  imports: [PrismaModule],
})
export class TagModule {}
