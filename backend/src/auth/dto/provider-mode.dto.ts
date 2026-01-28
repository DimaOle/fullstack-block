import { IsDefined, IsEnum } from 'class-validator';

export enum AuthMode {
  AUTH = 'auth',
  REG = 'reg',
}

export class ProviderModeDTO {
  @IsDefined() // гарантирует, что поле присутствует
  @IsEnum(AuthMode, { message: 'Mode mast be auth or reg' })
  mode: AuthMode;
}
