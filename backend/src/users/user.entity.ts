import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type ThemeMode = 'light' | 'dark';
export type ColorMode = 'amber' | 'blue' | 'pink' | 'rose' | 'emerald' | 'black';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  googleId: string;

  @Column({ default: 'Guest' })
  fullName: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ default: '#7C3AED' })
  avatarColor: string;

  @Column({ default: true })
  isGuest: boolean;

  @Column({ type: 'varchar', default: 'light' })
  theme: ThemeMode;

  @Column({ type: 'varchar', default: 'blue' })
  colorMode: ColorMode;

  @CreateDateColumn()
  createdAt: Date;
}
