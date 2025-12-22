import { AppUser } from "@/next-auth";
import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

type NestResponse = {
  access_token: string;
  refresh_token?: string;
};

type JwtPayload = {
  sub?: string;
  username?: string;
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
  [k: string]: unknown;
};

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;

    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(base64, "base64").toString("utf8");
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

function jwtExpMs(accessToken: string): number | null {
  const payload = decodeJwtPayload(accessToken);
  return typeof payload?.exp === "number" ? payload.exp * 1000 : null;
}

function userFromAccessToken(accessToken: string): AppUser | null {
  const payload = decodeJwtPayload(accessToken);
  if (!payload) return null;

  return {
    id: payload.sub ?? "",
    username: payload.username ?? null,
    email: payload.email ?? null,
    role: payload.role ?? null,
  };
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    if (!token.refreshToken) {
      return { ...token, error: "RefreshAccessTokenError" };
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: token.refreshToken }),
    });

    if (!res.ok) throw new Error("Refresh token failed");

    const data = (await res.json()) as NestResponse;
    const exp = jwtExpMs(data.access_token);
    const derivedUser = userFromAccessToken(data.access_token);

    return {
      ...token,
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? token.refreshToken,
      accessTokenExpires: exp ?? Date.now() + 10 * 60 * 1000,
      user: derivedUser ?? token.user,
      error: undefined,
    };
  } catch {
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username?.trim() ?? "";
        const password = credentials?.password ?? "";

        if (!username || !password) {
          throw new Error("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        if (!res.ok) {
          throw new Error("เข้าสู่ระบบไม่สำเร็จ");
        }

        const result = await res.json();

        const accessToken = result.data.accessToken;
        const refreshToken = result.data.refreshToken;

        if (!accessToken || !refreshToken) {
          throw new Error("ไม่พบ token จากระบบ");
        }

        const derivedUser = userFromAccessToken(accessToken);
        if (!derivedUser) {
          throw new Error("ไม่สามารถอ่านข้อมูลผู้ใช้จาก token ได้");
        }

        return {
          id: derivedUser.id,
          username: derivedUser.username ?? username,
          email: derivedUser.email,
          role: derivedUser.role,
          accessToken,
          refreshToken,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {

        const u = user as unknown as {
          id: string;
          username?: string | null;
          email?: string | null;
          role?: string | null;
          accessToken: string;
          refreshToken: string;
        };

        const exp = jwtExpMs(u.accessToken);
        const derivedUser = userFromAccessToken(u.accessToken);

        token.user = derivedUser ?? {
          id: u.id,
          username: u.username ?? null,
          email: u.email ?? null,
          role: u.role ?? null,
        };

        token.accessToken = u.accessToken;
        token.refreshToken = u.refreshToken;
        token.accessTokenExpires = exp ?? Date.now() + 10 * 60 * 1000;

        return token;
      }

      // ถ้ายังไม่หมดอายุ (เผื่อก่อน 30 วิ)
      if (
        token.accessTokenExpires &&
        Date.now() < token.accessTokenExpires - 30_000
      ) {
        return token;
      }

      // หมดอายุแล้ว → refresh
      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user = token.user ?? {
        id: "unknown",
        username: null,
        email: null,
        role: null,
      };
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
  pages: { signIn: "/login" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
