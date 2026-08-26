"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { adminLoginAction } from "@/actions/authActions";
import { Button } from "@/components/ui/Button";
import { BusinessLogo } from "@/components/shared/BusinessLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleFormAction = async (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await adminLoginAction(formData);
      if (result.success) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setError(result.error || "Invalid email or password. Please try again.");
      }
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    handleFormAction(formData);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <BusinessLogo size="lg" variant="login" showTagline={false} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal-900 tracking-tight">
              Sai Shraddha Tours & Travels
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
              Admin Workspace • Shirdi Desk
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white py-8 px-6 sm:px-8 shadow-sm rounded-2xl border border-stone-200 space-y-6">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-maroon" />
              <h2 className="text-sm font-bold text-brand-charcoal-900 uppercase tracking-wide">
                Staff & Owner Sign In
              </h2>
            </div>
            <span className="text-[11px] text-stone-400 font-semibold">Secure Portal</span>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form
            action={handleFormAction}
            onSubmit={handleSubmit}
            method="POST"
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-bold text-brand-charcoal-900 flex items-center gap-1"
              >
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="name@saishraddhatravels.com"
                disabled={isPending}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-brand-charcoal-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon disabled:bg-stone-50 disabled:text-stone-400"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-bold text-brand-charcoal-900 flex items-center gap-1"
              >
                <Lock className="w-3.5 h-3.5 text-stone-400" />
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  disabled={isPending}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-stone-300 text-xs sm:text-sm text-brand-charcoal-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon disabled:bg-stone-50 disabled:text-stone-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                variant="primary"
                disabled={isPending}
                className="w-full font-bold text-xs sm:text-sm shadow-xs"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  "Sign In to Admin Workspace"
                )}
              </Button>
            </div>
          </form>

          <div className="text-[11px] text-stone-400 text-center border-t border-stone-100 pt-4">
            Sai Ashram (Bhakta Niwas 1000 Rooms), Shirdi — 423 109
          </div>
        </div>
      </div>
    </div>
  );
}
