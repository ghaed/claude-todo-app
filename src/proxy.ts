import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If logged in and hitting /signin, redirect to home
    if (req.nextUrl.pathname === "/signin" && req.nextauth.token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token, req }) {
        // Allow /signin and /api/auth without a token
        const { pathname } = req.nextUrl;
        if (pathname === "/signin" || pathname.startsWith("/api/auth")) {
          return true;
        }
        return !!token;
      },
    },
    pages: {
      signIn: "/signin",
    },
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
