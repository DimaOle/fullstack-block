import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { EmailParamDto, UpdateUserDTO } from './dto';
import { Response } from 'express';
import { RequestWithUser } from './interfaces';

@Controller('user')
export class UserController {
  constructor(private readonly userSevice: UserService) {}

  @Get('all')
  findAll(@Res({ passthrough: true }) res: Response) {
    console.log(res.cookie);
  }

  @Get('byEmail/:email')
  findUserByEmail(@Param() value: EmailParamDto) {
    return this.userSevice.getUserByEmail(value.email);
  }
  @Get('byId/:id')
  findUserById(@Param('id', new ParseUUIDPipe()) userId: string) {
    return this.userSevice.getUserById(userId);
  }

  @Patch('update/:id')
  update(@Param('id', new ParseUUIDPipe()) userId: string, @Body() dto: UpdateUserDTO) {
    return this.userSevice.updateUser(userId, dto);
  }

  @Delete('delete/:email')
  deleteUser(@Param('email') email: string, @Req() req: RequestWithUser) {
    return this.userSevice.deleteUser(req, email);
  }
}
