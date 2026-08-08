import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from './workspace.entity';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace) private repo: Repository<Workspace>,
  ) {}

  async findOrCreateDefault(ownerId: string) {
    let workspace = await this.repo.findOne({ where: { ownerId } });
    if (!workspace) {
      workspace = this.repo.create({ name: 'Workspace', ownerId });
      workspace = await this.repo.save(workspace);
    }
    return workspace;
  }

  findAllForUser(ownerId: string) {
    return this.repo.find({ where: { ownerId } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }
}
