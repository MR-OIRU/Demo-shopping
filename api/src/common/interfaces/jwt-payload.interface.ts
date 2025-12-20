import { SystemUserRole } from 'src/database/entities';

export interface AuthJwtPayload extends Record<string, unknown> {
  sub: string;
  username: string;
  role: SystemUserRole;
  email: string;
}
