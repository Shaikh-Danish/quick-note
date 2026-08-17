import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for session cookie
  const sessionToken =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  // Static files and internal requests
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const publicPaths = ["/sign-in", "/sign-up", "/api/auth"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
  const isQuickDropView =
    /^\/[A-Za-z0-9]{6}$/.test(pathname) ||
    (request.method === "GET" &&
      /^\/api\/quickdrop\/[A-Za-z0-9]{6}$/.test(pathname));

  // /landing is not a real page — it was matching the drop [code] route
  if (pathname === "/landing") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If not logged in and trying to access protected routes
  if (!sessionToken && !isPublicPath && pathname !== "/" && !isQuickDropView) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If logged in and trying to access auth pages
  if (sessionToken && (pathname === "/sign-in" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
