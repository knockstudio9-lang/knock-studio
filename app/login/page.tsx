// app/login/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { useSession } from "@/components/providers/SessionProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import Link from "next/link";
import Image from "next/image";
import { Moon, Sun, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useSession();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      // Redirect is handled by the login function in SessionProvider
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative">
      {/* Theme Toggle - Top Right */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2 rounded-md transition-colors hover:bg-muted"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5 text-foreground" />
        ) : (
          <Moon className="h-5 w-5 text-foreground" />
        )}
      </button>

      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            {theme === "dark" ? (
              <Image
                src="/logo.gif"
                alt="Logo"
                width={300}
                height={60}
                className="h-auto w-32 mx-auto mb-4"
                priority
              />
            ) : (
              <Image
                src="/logo-black.gif"
                alt="Logo"
                width={300}
                height={60}
                className="h-auto w-32 mx-auto mb-4"
                priority
              />
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Improvement Studio
            </p>
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-[var(--radius-xl)] shadow-lg p-8 border border-border">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Welcome back
            </h2>
            <p className="text-muted-foreground mt-1">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-[var(--radius-md)] bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-colors"
                placeholder="you@example.com"
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 rounded-[var(--radius-md)] border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-600)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-[var(--radius-md)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:ring-offset-2"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Back to Home Link */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>

        {/* Demo Credentials */}
        {/* <div className="mt-6 p-4 bg-muted/50 rounded-[var(--radius-lg)] border border-border">
          <p className="text-xs font-semibold text-foreground mb-2">
            Demo Credentials:
          </p>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              <strong className="text-foreground">Admin:</strong> admin@example.com / admin123
            </p>
            <p>
              <strong className="text-foreground">User:</strong> user@example.com / user123
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
}