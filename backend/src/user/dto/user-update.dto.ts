import { PartialType } from '@nestjs/mapped-types';
import { RoleEnum } from '@prisma/client';
import { IsOptional, IsString, Length, Matches } from 'class-validator';
import { RegisterLocalUserDto } from 'src/auth/dto';

export class UpdateUserDTO extends PartialType(RegisterLocalUserDto) {
  @IsOptional()
  @Length(6, 12)
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Password must contain at least one letter and one number',
  })
  repeatPassword: string;

  @IsOptional()
  role: RoleEnum[];
}
