import { IsString } from 'class-validator';

export class AddTagDTO {
  @IsString()
  tagName: string;
}
