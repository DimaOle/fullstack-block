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
import { EmailParamDto, UserUpdateChangePassword, UserUpdateDto } from './dto';
import { Response } from 'express';
import { RequestWithUser } from './interfaces';
import { UserFromReq } from 'src/libs/common/src/decorators';

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
  @Get('myProfile')
  findOwnerProfile(@UserFromReq('userId') userId: string) {
    return this.userSevice.findOwnerProfile(userId);
  }

  @Patch('myProfile')
  update(@UserFromReq('userId') userId: string, @Body() dto: UserUpdateDto) {
    return this.userSevice.updateUser(userId, dto);
  }

  @Patch('changePass')
  updatePass(@UserFromReq('userId') userId: string, @Body() dto: UserUpdateChangePassword) {
    return this.userSevice.cahngePasswordUser(userId, dto);
  }

  @Delete('delete/:email')
  deleteUser(@Param('email') email: string, @Req() req: RequestWithUser) {
    return this.userSevice.deleteUser(req, email);
  }
}
