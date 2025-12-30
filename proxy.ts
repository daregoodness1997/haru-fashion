import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname;

  // Only apply CORS to API routes
  if (pathname.startsWith("/api/")) {
    // Get the origin
    const origin = request.headers.get("origin");

    // Allow these origins
    const allowedOrigins = [
      "https://www.shunapeefashion.com.ng",
      "https://shunapeefashion.com.ng",
      "http://localhost:3000",
      "http://localhost:3001",
    ];

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      const response = new NextResponse(null, { status: 200 });

      if (origin && allowedOrigins.includes(origin)) {
        response.headers.set("Access-Control-Allow-Origin", origin);
      }

      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
      );
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Requested-With"
      );
      response.headers.set("Access-Control-Max-Age", "86400");
      response.headers.set("Access-Control-Allow-Credentials", "true");

      return response;
    }

    // Handle actual requests
    const response = NextResponse.next();

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }

    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
