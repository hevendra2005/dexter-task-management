import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsIn(['no_priority', 'urgent', 'high', 'medium', 'low'])
  priority?: string;

  @IsOptional()
  @IsString()
  leadId?: string;

  @IsOptional()
  @IsString()
  dueDate?: string;
}
