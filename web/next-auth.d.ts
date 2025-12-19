import "next-auth";
import "next-auth/jwt";

export type AppUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

declare module "next-auth" {
  interface Session {
    user: AppUser;
    accessToken?: string;
    error?: "RefreshAccessTokenError";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: AppUser;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: "RefreshAccessTokenError";
  }
}
