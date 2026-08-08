import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Workspace } from '../workspaces/workspace.entity';

export type Priority = 'no_priority' | 'urgent' | 'high' | 'medium' | 'low';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'varchar', default: 'no_priority' })
  priority: Priority;

  @ManyToOne(() => User, { nullable: true, eager: true })
  lead: User;

  @Column({ nullable: true })
  dueDate: string;

  @ManyToOne(() => Workspace)
  workspace: Workspace;

  @Column()
  workspaceId: string;

  @CreateDateColumn()
  createdAt: Date;
}
