import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private repo: Repository<Task>) {}

  // Top-level tasks (not subtasks), optionally scoped to a project
  findAll(workspaceId: string, projectId?: string) {
    return this.repo.find({
      where: {
        workspaceId,
        parentId: IsNull(),
        ...(projectId ? { projectId } : {}),
      },
      relations: ['subtasks'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const task = await this.repo.findOne({
      where: { id },
      relations: ['subtasks', 'parent'],
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async create(workspaceId: string, reporterId: string, dto: CreateTaskDto) {
    const task = this.repo.create({
      title: dto.title,
      description: dto.description,
      status: (dto.status as any) || 'todo',
      priority: (dto.priority as any) || 'no_priority',
      dueDate: dto.dueDate,
      projectId: dto.projectId,
      parentId: dto.parentId,
      workspaceId,
      reporter: { id: reporterId } as any,
      members: dto.memberIds ? dto.memberIds.map((id) => ({ id } as any)) : [],
    });
    return this.repo.save(task);
  }

  async update(id: string, dto: UpdateTaskDto) {
    const task = await this.findOne(id);
    Object.assign(task, {
      ...dto,
      members: dto.memberIds
        ? dto.memberIds.map((mid) => ({ id: mid } as any))
        : task.members,
    });
    return this.repo.save(task);
  }

  async remove(id: string) {
    const task = await this.findOne(id);
    return this.repo.remove(task);
  }
}
