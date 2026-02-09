// components/dashboard/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "@/components/providers/SessionProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Home, LogOut, LayoutDashboard, Image as ImageIcon, FolderOpen, Settings, Heart, User } from "lucide-react";

interface SidebarProps {
  userRole: "admin" | "user";
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useSession();
  const { theme } = useTheme();
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  const adminNavigation = [
    {
      name: "Dashboard",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Portfolio",
      href: "/dashboard/admin/portfolio",
      icon: ImageIcon,
    },
    {
      name: "Settings",
      href: "/dashboard/admin/settings",
      icon: Settings,
    },
  ];

  const userNavigation = [
    {
      name: "Dashboard",
      href: "/dashboard/user",
      icon: LayoutDashboard,
    },
    {
      name: "My Projects",
      href: "/dashboard/user/portfolio",
      icon: FolderOpen,
    },
    {
      name: "Favorites",
      href: "/dashboard/user/favorites",
      icon: Heart,
    },
    {
      name: "Profile",
      href: "/dashboard/user/profile",
      icon: User,
    },
  ];

  const navigation = userRole === "admin" ? adminNavigation : userNavigation;

  return (
    <div className="w-64 bg-card border-r border-border shadow-sm h-full flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Link href={userRole === "admin" ? "/dashboard/admin" : "/dashboard/user"} className="flex items-center">
          {theme === "dark" ? (
            <Image
              src="/logo.gif" 
              alt="Logo" 
              width={300} 
              height={20}
              className="h-auto w-20" 
              priority
            />
          ) : (
            <Image
              src="/logo-black.gif" 
              alt="Logo" 
              width={300} 
              height={20}
              className="h-auto w-20" 
              priority
            />
          )}
        </Link>
        <p className="text-xs text-muted-foreground mt-2">
          {userRole === "admin" ? "Admin Panel" : "User Portal"}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center py-3 px-6 text-foreground hover:bg-muted transition-colors ${
                isActive ? "bg-muted border-r-4 border-[var(--color-secondary)]" : ""
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-border p-4 space-y-2">
        <button
          onClick={handleGoHome}
          className="w-full flex items-center py-2 px-4 text-foreground hover:bg-muted transition-colors rounded-md"
        >
          <Home className="h-5 w-5 mr-3" />
          Go to Site
        </button>
        <button
          onClick={() => logout()}
          className="w-full flex items-center py-2 px-4 text-foreground hover:bg-muted transition-colors rounded-md"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
}