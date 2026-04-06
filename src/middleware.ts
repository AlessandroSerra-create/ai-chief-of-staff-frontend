export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    /*
     * Protect every route except:
     * - /login
     * - /api/auth (NextAuth endpoints)
     * - _next/static, _next/image, favicon.ico (Next.js internals)
     */
    "/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
