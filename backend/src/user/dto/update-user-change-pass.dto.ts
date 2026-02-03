import { IsNotEmpty, Length, Matches } from 'class-validator';
import { Match } from 'src/auth/pipes';

export class UserUpdateChangePassword {
  @IsNotEmpty()
  @Length(6, 30)
  password: string;

  @IsNotEmpty()
  @Length(6, 30)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Password must contain at least one letter and one number',
  })
  newPassword: string;

  @IsNotEmpty()
  @Length(6, 30)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Password must contain at least one letter and one number',
  })
  @Match('newPassword', { message: "The passwords don't match" })
  repeatPassword;
}
