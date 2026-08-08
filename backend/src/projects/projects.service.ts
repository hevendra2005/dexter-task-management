import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private repo: Repository<Project>,
  ) {}

  findAll(workspaceId: string) {
    return this.repo.find({
      where: { workspaceId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const project = await this.repo.findOne({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  create(workspaceId: string, dto: CreateProjectDto) {
    const project = this.repo.create({
      name: dto.name,
      priority: (dto.priority as any) || 'no_priority',
      dueDate: dto.dueDate,
      workspaceId,
      lead: dto.leadId ? ({ id: dto.leadId } as any) : null,
    });
    return this.repo.save(project);
  }

  async update(id: string, dto: UpdateProjectDto) {
    const project = await this.findOne(id);
    Object.assign(project, {
      ...dto,
      lead: dto.leadId ? ({ id: dto.leadId } as any) : project.lead,
    });
    return this.repo.save(project);
  }

  async remove(id: string) {
    const project = await this.findOne(id);
    return this.repo.remove(project);
  }
}
