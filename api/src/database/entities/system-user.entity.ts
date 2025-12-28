import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserSession } from './user-session.entity';

export enum SystemUserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum SystemUserRole {
  SUPER_ADMIN = 'superadmin',
  SUPPORT = 'support',
}

@Entity({ name: 'system_users' })
export class SystemUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ name: 'password_hash', select: false })
  @Exclude()
  passwordHash: string;

  @Column({ type: 'enum', enum: SystemUserRole })
  role: SystemUserRole;

  @Column({
    type: 'enum',
    enum: SystemUserStatus,
    default: SystemUserStatus.ACTIVE,
  })
  status: SystemUserStatus;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ name: 'profile_url', type: 'varchar', length: 255, nullable: true })
  profileUrl?: string;

  @Column({ type: 'timestamptz', nullable: true, name: 'last_login_at' })
  lastLoginAt?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => UserSession, (session) => session.user)
  sessions?: UserSession[];
}
