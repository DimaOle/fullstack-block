import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/libs/common/src/decorators';
import { AddTagDTO } from './dto';
import { TagService } from './tag.service';
import { RolesGuard } from 'src/libs/common/src/guards';

@Roles(['ADMIN'])
@UseGuards(RolesGuard)
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post('add')
  addTag(@Body() dto: AddTagDTO) {
    return this.tagService.addTag(dto);
  }

  @Delete('delete/:id')
  deleteTag(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.deleteTag(id);
  }

  @Get()
  getAll() {
    return this.tagService.geatAll();
  }
  @Get('byName/:name')
  getByName(@Param('name') name: string) {
    return this.tagService.getByParam('name', name);
  }

  @Get('byId/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.getByParam('id', id);
  }
}
