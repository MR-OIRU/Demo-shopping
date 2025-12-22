import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const locale =
    req.cookies.get("locale")?.value ||
    req.headers.get("accept-language")?.split(",")?.[0]?.split("-")?.[0] ||
    "th";

  const headers = new Headers(req.headers);
  headers.set("x-locale", locale);

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    const res = NextResponse.redirect(url);
    
    return res;
  }

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/admin/:path*"],
};
