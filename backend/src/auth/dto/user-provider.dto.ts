import { ProviderEnum } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class UserProviderDTO {
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @Length(2, 100)
  firstName: string;

  @IsOptional()
  @Length(2, 100)
  lastName: string;

  @IsOptional()
  @IsEmail()
  provider: ProviderEnum;

  @IsString()
  mode: string;
}
