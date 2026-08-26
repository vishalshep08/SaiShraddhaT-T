import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const pathname = request.nextUrl.pathname;

  // Only run protection logic on /admin routes
  if (!pathname.startsWith("/admin")) {
    return response;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
  const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

  let isAuthenticated = false;

  // 1. Check live Supabase Auth session
  if (!isPlaceholder) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({ name, value, ...options });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({ name, value: "", ...options });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({ name, value: "", ...options });
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        isAuthenticated = true;
      }
    } catch (e) {
      // Supabase connection error fallback
    }
  }

  // 2. Check secure admin session cookie fallback (for local development/offline)
  if (!isAuthenticated) {
    const adminSession = request.cookies.get("admin_session")?.value;
    if (adminSession) {
      try {
        const parsed = JSON.parse(adminSession);
        if (parsed && parsed.id && parsed.role === "admin") {
          isAuthenticated = true;
        }
      } catch (e) {
        // Invalid cookie format
      }
    }
  }

  const isLoginPage = pathname === "/admin/login";

  // If user is already authenticated and tries to visit login page -> redirect to dashboard
  if (isLoginPage && isAuthenticated) {
    const dashboardUrl = new URL("/admin/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // If user is NOT authenticated and tries to visit protected admin route -> redirect to login
  if (!isLoginPage && !isAuthenticated) {
    const loginUrl = new URL("/admin/login", request.url);
    // Never expose credentials, tokens, or sensitive redirect params in URL
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all /admin routes
     */
    "/admin/:path*",
  ],
};
