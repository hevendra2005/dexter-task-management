import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';

@Injectable()
export class CommentsService {
  constructor(@InjectRepository(Comment) private repo: Repository<Comment>) {}

  findAllForTask(taskId: string) {
    return this.repo.find({
      where: { taskId },
      order: { createdAt: 'ASC' },
    });
  }

  create(taskId: string, authorId: string, content: string) {
    const comment = this.repo.create({
      taskId,
      author: { id: authorId } as any,
      content,
    });
    return this.repo.save(comment);
  }
}
