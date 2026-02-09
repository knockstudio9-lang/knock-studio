// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-this-in-production"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/projects"];
  const isPublicRoute = publicRoutes.some((route) => 
    pathname === route || pathname.startsWith("/api/auth")
  );

  // Allow access to public routes and static files
  if (isPublicRoute || pathname.startsWith("/_next") || pathname.startsWith("/static")) {
    return NextResponse.next();
  }

  // Check for auth token
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    // Redirect to login if no token
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verify the token
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Check role-based access
    if (pathname.startsWith("/dashboard/admin")) {
      if (payload.role !== "admin") {
        // Non-admin trying to access admin routes
        return NextResponse.redirect(new URL("/dashboard/user", request.url));
      }
    }

    if (pathname.startsWith("/dashboard/user")) {
      if (payload.role !== "user") {
        // Admin trying to access user routes - redirect to admin
        return NextResponse.redirect(new URL("/dashboard/admin", request.url));
      }
    }

    // If just /dashboard, redirect based on role
    if (pathname === "/dashboard") {
      if (payload.role === "admin") {
        return NextResponse.redirect(new URL("/dashboard/admin", request.url));
      } else {
        return NextResponse.redirect(new URL("/dashboard/user", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    // Invalid or expired token
    console.error("Token verification failed:", error);
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("auth-token");
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};