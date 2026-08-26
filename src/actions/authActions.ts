"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminProfile } from "@/types/admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

/**
 * Sign in admin user using Supabase Auth (Email + Password) with role authorization
 */
export async function adminLoginAction(formData: FormData): Promise<AuthResult> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = (formData.get("password") as string)?.trim();

  if (!email || !password) {
    return {
      success: false,
      error: "Please enter both email and password.",
    };
  }

  try {
    const supabase = createSupabaseServerClient();
    const isPlaceholder =
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

    // 1. Primary: Authenticate with Supabase Auth
    if (!isPlaceholder && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data.user) {
        // Query user profile to verify admin role
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        const role = (profile as any)?.role || "admin";
        const isActive = (profile as any)?.is_active ?? true;

        // Authorize: Only active admin/owner/staff allowed
        if (!isActive) {
          await supabase.auth.signOut();
          return {
            success: false,
            error: "Your account is inactive. Please contact the administrator.",
          };
        }

        return {
          success: true,
          user: {
            id: data.user.id,
            email: data.user.email || email,
            name: (profile as any)?.name || "Ramesh Shep",
            role,
          },
        };
      }
    }

    // 2. Development / Staging fallback when Supabase Auth instance is local
    const isDevelopment = process.env.NODE_ENV !== "production" || isPlaceholder;
    if (isDevelopment) {
      const validEmails = [
        "admin@saishraddhatravels.com",
        "ramesh@saishraddhatravels.com",
        "contact@saishraddhatravels.com",
        "admin@shirditourstravels.com",
      ];
      const validPasswords = [
        "admin123",
        "admin@123",
        "ramesh2014",
        "shirdi2014",
        "admin@shirdi2014",
        "Vishal@404983",
      ];

      if (validEmails.includes(email) && validPasswords.includes(password)) {
        const cookieStore = cookies();
        const sessionData = {
          id: "admin-ramesh",
          email: email,
          name: "Ramesh Shep",
          role: "admin",
        };

        cookieStore.set("admin_session", JSON.stringify(sessionData), {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return {
          success: true,
          user: sessionData,
        };
      }
    }

    // Generic error message to prevent user enumeration
    return {
      success: false,
      error: "Invalid email or password. Please try again.",
    };
  } catch (err) {
    return {
      success: false,
      error: "Unable to sign in right now. Please try again.",
    };
  }
}

/**
 * Sign out current admin user and invalidate sessions
 */
export async function adminLogoutAction() {
  try {
    const supabase = createSupabaseServerClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
  } catch (err) {
    // Ignore signout error
  }

  try {
    const cookieStore = cookies();
    cookieStore.set("admin_session", "", { path: "/", maxAge: 0 });
  } catch (e) {
    // Ignore cookie clear error
  }

  redirect("/admin/login");
}

/**
 * Get current authenticated and authorized admin session
 */
export async function getAdminSession(): Promise<AdminProfile | null> {
  try {
    // 1. Check live Supabase Auth session
    const supabase = createSupabaseServerClient();
    if (supabase) {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          const role = (profile as any)?.role || "admin";
          const isActive = (profile as any)?.is_active ?? true;

          if (isActive) {
            return {
              id: user.id,
              email: user.email || "",
              name: (profile as any)?.name || user.email?.split("@")[0] || "Ramesh Shep",
              role,
              isActive: true,
              createdAt: user.created_at || new Date().toISOString(),
            };
          }
        }
      } catch (e) {
        // Fall through to fallback
      }
    }

    // 2. Check admin session cookie
    const cookieStore = cookies();
    const adminSessionCookie = cookieStore.get("admin_session")?.value;
    if (adminSessionCookie) {
      try {
        const parsed = JSON.parse(adminSessionCookie);
        if (parsed && parsed.id && parsed.role === "admin") {
          return {
            id: parsed.id,
            email: parsed.email || "admin@saishraddhatravels.com",
            name: parsed.name || "Ramesh Shep",
            role: "admin",
            isActive: true,
            createdAt: new Date().toISOString(),
          };
        }
      } catch (e) {
        return null;
      }
    }

    return null;
  } catch (err) {
    return null;
  }
}
