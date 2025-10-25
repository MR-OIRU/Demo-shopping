import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const locale = request.cookies.get('locale')?.value ||
                 request.headers.get('accept-language')?.split(',')[0].split('-')[0] ||
                 'th';

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', locale);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
