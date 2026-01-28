import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/libs/common/src/decorators';
import { OwnerOrAdminGuard, RolesGuard } from 'src/libs/common/src/guards';
import { AddSongDTO, FindSongQueryDto, UpdateSongDTO } from './dto';
import { SongService } from './song.service';
import { SongFindsParamKeys } from './common/types';

@Controller('song')
export class SongController {
  constructor(private readonly SongService: SongService) {}
  @Get('getAll')
  getAll() {
    return this.SongService.getAllSongs();
  }

  @Roles(['ADMIN'])
  @UseGuards(RolesGuard)
  @Post('add')
  add(@Body() dto: AddSongDTO) {
    return this.SongService.addSong(dto);
  }

  @Get('getBy')
  getBy(@Query() query: FindSongQueryDto) {
    const keys = Object.keys(query) as SongFindsParamKeys[];
    return this.SongService.findSongByParms(keys[0], query[keys[0]]);
  }
  @UseGuards(OwnerOrAdminGuard)
  @Delete('delete/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.SongService.deleteSongById(id);
  }

  @UseGuards(OwnerOrAdminGuard)
  @Patch('update/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSongDTO) {
    console.log(dto);
    return this.SongService.updateSong(id, dto);
  }
}
