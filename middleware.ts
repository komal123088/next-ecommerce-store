import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "admin";
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        if (
          pathname.startsWith("/admin") ||
          pathname.startsWith("/account") ||
          pathname.startsWith("/checkout")
        ) {
          return !!token;
        }
        return true;
      },
    },
  },
);

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/checkout/:path*"],
};
