import { IsEmail, IsOptional, IsString } from 'class-validator';
import { AtLeastOneProperty } from 'src/libs/common/src/decorators';

@AtLeastOneProperty()
export class UserUpdateDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;
}
