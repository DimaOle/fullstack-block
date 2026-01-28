import { Controller, Post, Body, Req, Get, Query } from '@nestjs/common';
import { ReviewService } from './review.service';
import { RateSong, ScoreBySong } from './dto';
import { UserFromReq } from 'src/libs/common/src/decorators';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('score/set')
  setScore(@UserFromReq('userId') userId: string, @Body() dto: RateSong) {
    return this.reviewService.rateSong(dto, userId);
  }

  @Get('score/get-by-song')
  getScore(@Query() query: ScoreBySong) {
    return this.reviewService.getScore(query);
  }
}
