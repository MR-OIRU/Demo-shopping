import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  SystemUser,
  SystemUserRole,
  SystemUserStatus,
  UserSession,
} from 'src/database/entities';
import { Repository } from 'typeorm';
import { LoginDto } from './dto';
import { AuthJwtPayload } from 'src/common/interfaces';
import { randomBytes, randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import ms from 'ms';

export interface CurrentUser {
  id: string;
  username: string;
  role: SystemUserRole;
  email: string;
}

interface SessionMeta {
  user?: string;
  ip?: string;
}

@Injectable()
export class AuthService {
  private readonly ACCESS_TOKEN_EXPIRY = '15m';
  private readonly REFRESH_TOKEN_EXPIRY = '7d';

  constructor(
    @InjectRepository(SystemUser)
    private readonly userRepository: Repository<SystemUser>,
    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto, ipAddress: string) {
    const user = await this.validateUser(dto.username, dto.password);

    const currentUser: CurrentUser = {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email || '',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(currentUser),
      this.issueRefreshToken(user.id, { ip: ipAddress }),
    ]);

    await this.userRepository.update(user.id, {
      lastLoginAt: new Date(),
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.durationToMs(this.ACCESS_TOKEN_EXPIRY),
      user: currentUser,
    };
  }

  async refresh(refreshToken: string, ipAddress: string) {
    const { sessionId, tokenSecret } = this.parseRefreshToken(refreshToken);
    // console.log('Parsed refresh token:', { sessionId, tokenSecret });
    const session = await this.userSessionRepository.findOne({
      where: { id: sessionId },
      relations: ['user'],
    });

    if (!session || session.revokedAt) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const isValidSecret = await this.verifyTokenSecret(
      tokenSecret,
      session.refreshTokenHash,
    );
    if (!isValidSecret) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.userSessionRepository.update(session.id, {
      revokedAt: new Date(),
    });

    const user = session.user;

    const currentUser: CurrentUser = {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email || '',
    };

    const [newAccessToken, newRefreshToken] = await Promise.all([
      this.generateAccessToken(currentUser),
      this.issueRefreshToken(user.id, { ip: ipAddress }),
    ]);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: this.durationToMs(this.ACCESS_TOKEN_EXPIRY),
      user: currentUser,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    const { sessionId } = this.parseRefreshToken(refreshToken);

    await this.userSessionRepository.update(sessionId, {
      revokedAt: new Date(),
    });
  }

  private async generateAccessToken(user: CurrentUser): Promise<string> {
    const payload: AuthJwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
    };

    return this.jwtService.signAsync(payload);
  }

  private async issueRefreshToken(
    userId: string,
    meta?: SessionMeta,
  ): Promise<string> {
    const secret = randomBytes(32).toString('hex');
    const hash = await this.hashTokenSecret(secret);
    const sessionId = randomUUID();
    const expiresAt = this.durationToDate(this.REFRESH_TOKEN_EXPIRY);

    const session = this.userSessionRepository.create({
      id: sessionId,
      userId,
      refreshTokenHash: hash,
      expiresAt,
      ipAddress: meta?.ip,
    });

    await this.userSessionRepository.save(session);

    return `${sessionId}.${secret}`;
  }

  private async validateUser(
    username: string,
    password: string,
  ): Promise<SystemUser> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) throw new BadRequestException('Invalid username or password');

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) throw new BadRequestException('Invalid username or password');
    
    if (user.status !== SystemUserStatus.ACTIVE) throw new BadRequestException(`This account is inactive. \nPlease contact an administrator.`);

    return user;
  }

  private parseRefreshToken(token: string): {
    sessionId: string;
    tokenSecret: string;
  } {
    const [sessionId, tokenSecret] = token.split('.');

    if (!sessionId || !tokenSecret) {
      throw new UnauthorizedException('Malformed refresh token');
    }

    return { sessionId, tokenSecret };
  }

  private async hashTokenSecret(secret: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const jwtSecret =
      this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET') ?? '';
    return bcrypt.hash(secret + jwtSecret, salt);
  }

  private async verifyTokenSecret(
    secret: string,
    hash: string,
  ): Promise<boolean> {
    const jwtSecret =
      this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET') ?? '';
    return bcrypt.compare(secret + jwtSecret, hash);
  }

  private durationToMs(duration: string): number {
    const value = ms(duration);
    if (typeof value === 'number') return value;

    const numeric = Number(duration);
    if (Number.isFinite(numeric)) return numeric;

    throw new Error(`Unable to parse duration: ${duration}`);
  }

  private durationToDate(duration: string): Date {
    return new Date(Date.now() + this.durationToMs(duration));
  }
}
