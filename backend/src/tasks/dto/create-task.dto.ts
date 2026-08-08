import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['backlog', 'todo', 'doing', 'completed', 'on_hold'])
  status?: string;

  @IsOptional()
  @IsIn(['no_priority', 'urgent', 'high', 'medium', 'low'])
  priority?: string;

  @IsOptional()
  @IsString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsArray()
  memberIds?: string[];
}
