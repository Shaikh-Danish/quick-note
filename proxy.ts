import { type NextRequest, NextResponse } from "next/server";

function hasSessionCookie(request: NextRequest) {
  return request.cookies.getAll().some((cookie) => {
    const name = cookie.name;
    return (
      name === "better-auth.session_token" ||
      name === "__Secure-better-auth.session_token" ||
      name === "__Host-better-auth.session_token" ||
      name.startsWith("better-auth.session_token.") ||
      name.startsWith("__Secure-better-auth.session_token.") ||
      name.startsWith("__Host-better-auth.session_token.")
    );
  });
}

function isDropShareRequest(pathname: string) {
  const path = pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;

  if (path.startsWith("/api/quickdrop/")) {
    return true;
  }

  const reserved = new Set([
    "quickdrop",
    "print",
    "sign-in",
    "sign-up",
    "landing",
    "api",
    "_next",
    "static",
  ]);
  const segments = path.split("/").filter(Boolean);
  return segments.length === 1 && !reserved.has(segments[0].toLowerCase());
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (pathname === "/landing") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Share links must work without an account
  if (isDropShareRequest(pathname)) {
    return NextResponse.next();
  }

  const publicPaths = ["/sign-in", "/sign-up", "/api/auth"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  if (!hasSessionCookie(request) && !isPublicPath && pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    hasSessionCookie(request) &&
    (pathname === "/sign-in" || pathname === "/sign-up")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Keep drop share URLs and /api/quickdrop/:code out of this list so
    // unauthenticated recipients are never redirected to login.
    "/((?!api/auth|api/quickdrop/|_next/static|_next/image|favicon.ico).*)",
  ],
};
