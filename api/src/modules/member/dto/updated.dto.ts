import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { SystemUserRole, SystemUserStatus } from 'src/database/entities';

export class UpdateProfile {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  confirmPassword?: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class CreatedOrUpdatedMember {
  @IsString()
  @IsOptional()
  id: string;

  @IsEmail()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  confirmPassword?: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEnum(SystemUserRole)
  role: SystemUserRole;
}

export class UpdateStatus {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEnum(SystemUserStatus)
  @IsNotEmpty()
  status: SystemUserStatus;
}
