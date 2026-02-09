// components/dashboard/Header.tsx
"use client";

import { useSession } from "@/components/providers/SessionProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Moon, Sun, Home, LogOut, Bell } from "lucide-react";
import { useRouter } from "next/navigation";

export function Header() {
  const { user, logout } = useSession();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container-custom px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-sm text-muted-foreground capitalize">
            {user?.role} Dashboard
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Go to Site Home Button */}
          <button
            onClick={handleGoHome}
            className="p-2 rounded-md transition-colors hover:bg-muted"
            aria-label="Go to site home"
            title="Go to site home"
          >
            <Home className="h-5 w-5 text-foreground" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md transition-colors hover:bg-muted"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-foreground" />
            ) : (
              <Moon className="h-5 w-5 text-foreground" />
            )}
          </button>

          {/* Notification icon */}
          <button 
            className="p-2 rounded-md hover:bg-muted transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-foreground" />
          </button>

          {/* User avatar */}
          <div className="w-8 h-8 rounded-full bg-[var(--color-secondary)] flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleSignOut}
            className="p-2 rounded-md transition-colors hover:bg-muted"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}