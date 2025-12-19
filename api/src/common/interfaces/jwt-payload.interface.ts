import { SystemUserType } from "../enums/system-user-type.enum";

export interface AuthJwtPayload extends Record<string, unknown> {
  sub: string;
  username: string;
  type: SystemUserType;
}
