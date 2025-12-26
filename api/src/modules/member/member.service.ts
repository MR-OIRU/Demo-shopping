import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemUser, SystemUserRole } from 'src/database/entities';
import { Not, Repository } from 'typeorm';
import { MemberItem, MembersItem } from './types/member';
import {
  UpdateStatus,
  UpdateProfile,
  CreatedOrUpdatedMember,
} from './dto/updated.dto';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import sharp from 'sharp';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(SystemUser)
    private readonly userRepository: Repository<SystemUser>,
  ) {}

  async getMembers(): Promise<MembersItem[]> {
    const response = await this.userRepository.find();

    if (!response) {
      return [];
    }

    const data: MembersItem[] = response.map((item) => ({
      id: item.id,
      profile: item.profileUrl ?? '',
      username: item.username,
      email: item.email ?? '',
      role: item.role,
      phone: item.phone ?? '',
      lastLogin: item.lastLoginAt ? item.lastLoginAt.toISOString() : '',
      created: item.createdAt.toISOString(),
      status: item.status,
    }));

    return data;
  }

  async getMemberDetail(id: string): Promise<MemberItem> {
    const response = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'role', 'phone', 'profileUrl'],
    });

    if (!response) throw new BadRequestException('User not found');

    const data: MemberItem = {
      id: response.id,
      username: response.username,
      email: response.email ?? '',
      role: response.role,
      phone: response.phone ?? '',
      profileUrl: response.profileUrl ?? '',
    };

    return data;
  }

  async updatedProfile(
    user: string,
    data: UpdateProfile,
    file?: Express.Multer.File,
  ): Promise<void> {
    const exists = await this.userRepository.findOne({ where: { id: user } });

    if (!exists) throw new BadRequestException('User not found');

    if (data.password && data.password !== data.confirmPassword) {
      throw new BadRequestException(
        'Password and confirm password do not match',
      );
    }

    let profileUrl = '';
    if (file) {
      const MAX = 2 * 1024 * 1024;
      if (file.size > MAX) throw new BadRequestException('ไฟล์ใหญ่เกิน 2MB');

      const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);
      if (!allowed.has(file.mimetype)) {
        throw new BadRequestException('อนุญาตเฉพาะ JPG, PNG, WEBP');
      }

      const meta = await sharp(file.buffer)
        .metadata()
        .catch(() => null);
      if (!meta) throw new BadRequestException('ไฟล์รูปภาพไม่ถูกต้อง');

      const filename = `${Date.now()}-${randomUUID()}.webp`;

      // const uploadDir = path.join(process.cwd(), 'uploads', 'profile');
      // await fs.mkdir(uploadDir, { recursive: true });

      // const outputPath = path.join(uploadDir, filename);
      // await sharp(file.buffer)
      //   .rotate()
      //   .resize({ width: 512, height: 512, fit: 'cover' })
      //   .webp({ quality: 85 })
      //   .toFile(outputPath);

      profileUrl = `/uploads/profile/${filename}`;
    }

    let password_hash = '';
    if (data.password) password_hash = await bcrypt.hash(data.password, 10);

    await this.userRepository.update(
      { id: user },
      {
        email: data.email,
        phone: data.phone,
        ...(profileUrl ? { profileUrl } : {}),
        ...(data.password ? { passwordHash: password_hash } : {}),
      },
    );
  }

  async createdOrUpdatedMember(
    data: CreatedOrUpdatedMember,
    file?: Express.Multer.File,
  ): Promise<void> {
    const isUpdate = !!data.id;

    const profileUrl = file ? await this.validateAndBuildProfileUrl(file) : '';

    if (isUpdate) {
      const exists = await this.userRepository.findOne({
        where: { id: data.id },
      });
      if (!exists) throw new BadRequestException('User not found');
    }

    if (!isUpdate) {
      if (!data.password)
        throw new BadRequestException('Please enter your password');
    }

    if (data.password && data.password !== data.confirmPassword) {
      throw new BadRequestException(
        'Password and confirm password do not match',
      );
    }

    const whereNotSelf = isUpdate ? { id: Not(data.id) } : {};
    const [emailDup, usernameDup, phoneDup] = await Promise.all([
      this.userRepository.findOne({
        where: { email: data.email, ...whereNotSelf },
      }),
      this.userRepository.findOne({
        where: { username: data.username, ...whereNotSelf },
      }),
      this.userRepository.findOne({
        where: { phone: data.phone, ...whereNotSelf },
      }),
    ]);

    if (emailDup) throw new BadRequestException('Email already exists');
    if (usernameDup) throw new BadRequestException('Username already exists');
    if (phoneDup) throw new BadRequestException('Phone already exists');

    const payload: Partial<SystemUser> = {
      role: data.role,
      email: data.email,
      username: data.username,
      phone: data.phone,
      ...(profileUrl ? { profileUrl } : {}),
      ...(data.password
        ? { passwordHash: await bcrypt.hash(data.password, 10) }
        : {}),
    };

    if (isUpdate) {
      await this.userRepository.update({ id: data.id }, payload);
    } else {
      await this.userRepository.insert(payload);
    }
  }

  private async validateAndBuildProfileUrl(
    file: Express.Multer.File,
  ): Promise<string> {
    const MAX = 2 * 1024 * 1024;
    if (file.size > MAX) throw new BadRequestException('ไฟล์ใหญ่เกิน 2MB');

    const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);
    if (!allowed.has(file.mimetype)) {
      throw new BadRequestException('อนุญาตเฉพาะ JPG, PNG, WEBP');
    }

    const meta = await sharp(file.buffer)
      .metadata()
      .catch(() => null);
    if (!meta) throw new BadRequestException('ไฟล์รูปภาพไม่ถูกต้อง');

    const filename = `${Date.now()}-${randomUUID()}.webp`;
    return `/uploads/profile/${filename}`;
  }

  async updatedStatus(data: UpdateStatus): Promise<void> {
    const exists = await this.userRepository.findOne({
      where: { id: data.id },
    });

    if (!exists) throw new BadRequestException('User not found');

    await this.userRepository.update(
      { id: data.id },
      {
        status: data.status,
      },
    );
  }

  async deleteMember(id: string): Promise<void> {
    const exists = await this.userRepository.findOne({
      where: { id },
    });

    if (!exists) throw new BadRequestException('User not found');

    if (exists.role === SystemUserRole.SUPER_ADMIN) {
      throw new BadRequestException('Cannot Delete Role Super Admin!!');
    }

    await this.userRepository.delete({ id });
  }
}
