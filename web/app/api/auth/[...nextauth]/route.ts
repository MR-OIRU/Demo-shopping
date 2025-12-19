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
  name?: string;
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

  const idRaw = payload.sub;
  if (idRaw === undefined || idRaw === null) return null;

  return {
    id: String(idRaw),
    name: payload.name ?? null,
    email: payload.email ?? null,
    role: payload.role ?? null,
  };
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    if (!token.refreshToken) {
      return { ...token, error: "RefreshAccessTokenError" };
    }

    const res = await fetch(`${process.env.NEST_API_URL}/auth/refresh`, {
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

        const res = await fetch(`${process.env.NEST_API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        let message = "เข้าสู่ระบบไม่สำเร็จ";

        const body = await res.json();

        if (typeof body?.message === "string") {
          message = body.message;
        }

        if (!res.ok) {
          throw new Error(message);
        }

        const accessToken = body.access_token;
        const refreshToken = body.refresh_token;

        if (!accessToken || !refreshToken) {
          throw new Error("ไม่พบ token จากระบบ");
        }

        const derivedUser = userFromAccessToken(accessToken);
        if (!derivedUser) {
          throw new Error("ไม่สามารถอ่านข้อมูลผู้ใช้จาก token ได้");
        }

        return {
          id: derivedUser.id,
          name: derivedUser.name ?? username,
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
          name?: string | null;
          email?: string | null;
          role?: string | null;
          accessToken: string;
          refreshToken: string;
        };

        const exp = jwtExpMs(u.accessToken);
        const derivedUser = userFromAccessToken(u.accessToken);

        token.user = derivedUser ?? {
          id: u.id,
          name: u.name ?? null,
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
        name: null,
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
