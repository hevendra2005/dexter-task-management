import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Workspace } from '../workspaces/workspace.entity';
import { Project } from '../projects/project.entity';

export type TaskStatus = 'backlog' | 'todo' | 'doing' | 'completed' | 'on_hold';
export type Priority = 'no_priority' | 'urgent' | 'high' | 'medium' | 'low';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', default: 'todo' })
  status: TaskStatus;

  @Column({ type: 'varchar', default: 'no_priority' })
  priority: Priority;

  @Column({ nullable: true })
  dueDate: string;

  @ManyToOne(() => User, { nullable: true, eager: true })
  reporter: User;

  @ManyToMany(() => User, { eager: true })
  @JoinTable({ name: 'task_members' })
  members: User[];

  @ManyToOne(() => Project, { nullable: true, onDelete: 'CASCADE' })
  project: Project;

  @Column({ nullable: true })
  projectId: string;

  // Parent task, when this row is a subtask
  @ManyToOne(() => Task, (task) => task.subtasks, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent: Task;

  @Column({ nullable: true })
  parentId: string;

  @OneToMany(() => Task, (task) => task.parent)
  subtasks: Task[];

  @Column()
  workspaceId: string;

  @CreateDateColumn()
  createdAt: Date;
}
