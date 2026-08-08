import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsIn(['light', 'dark'])
  theme?: 'light' | 'dark';

  @IsOptional()
  @IsIn(['amber', 'blue', 'pink', 'rose', 'emerald', 'black'])
  colorMode?: 'amber' | 'blue' | 'pink' | 'rose' | 'emerald' | 'black';
}
