// components/dashboard/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "@/components/providers/SessionProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { 
  Home, 
  LogOut, 
  LayoutDashboard, 
  Image as ImageIcon, 
  FolderOpen, 
  Settings, 
  Heart, 
  User, 
  Contact,
  Wrench,
  Package
} from "lucide-react";

// Define proper types for navigation items
interface NavigationItem {
  name: string;
  icon: any;
  href?: string;
  isCategory?: boolean;
  isSubItem?: boolean;
}

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

  const adminNavigation: NavigationItem[] = [
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
      name: "Services",
      icon: Package,
      isCategory: true,
    },
    {
      name: "Service Management",
      href: "/dashboard/admin/services",
      icon: Wrench,
      isSubItem: true,
    },
    {
      name: "Comparison Matrix",
      href: "/dashboard/admin/comparison",
      icon: LayoutDashboard,
      isSubItem: true,
    },
    {
      name: "Contact Form",
      href: "/dashboard/admin/contact-submissions",
      icon: Contact,
    },
    {
      name: "Settings",
      href: "/dashboard/admin/settings",
      icon: Settings,
    },
  ];

  const userNavigation: NavigationItem[] = [
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
      <div className="p-6 border-b border-border">
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
        <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider font-medium">
          {userRole === "admin" ? "Admin Panel" : "User Portal"}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="space-y-1 px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            // Category header (non-clickable)
            if (item.isCategory) {
              return (
                <div 
                  key={item.name}
                  className="flex items-center px-3 py-2 mt-4 mb-1"
                >
                  <Icon className="size-5 mr-2 text-foreground" />
                  <span className="font-semibold text-foreground uppercase tracking-wider">
                    {item.name}
                  </span>
                </div>
              );
            }

            // Sub-items (indented)
            if (item.isSubItem) {
              return (
                <Link
                  key={item.name}
                  href={item.href || "#"}
                  className={`flex items-center pl-9 pr-3 py-2.5 text-sm rounded-lg transition-all duration-200 group relative ${
                    isActive 
                      ? "bg-secondary/10 text-secondary font-medium" 
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-secondary rounded-r-full" />
                  )}
                  <Icon className={`h-4 w-4 mr-3 transition-colors ${
                    isActive ? "text-secondary" : "text-muted-foreground group-hover:text-foreground"
                  }`} />
                  {item.name}
                </Link>
              );
            }

            // Regular items
            return (
              <Link
                key={item.name}
                href={item.href || "#"}
                className={`flex items-center px-3 py-2.5 text-sm rounded-lg transition-all duration-200 group relative ${
                  isActive 
                    ? "bg-secondary/10 text-secondary font-medium" 
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-secondary rounded-r-full" />
                )}
                <Icon className={`h-5 w-5 mr-3 transition-colors ${
                  isActive ? "text-secondary" : "text-muted-foreground group-hover:text-foreground"
                }`} />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-border p-4 space-y-1">
        <button
          onClick={handleGoHome}
          className="w-full flex items-center px-3 py-2.5 text-sm text-foreground hover:bg-muted transition-all duration-200 rounded-lg group"
        >
          <Home className="h-5 w-5 mr-3 text-muted-foreground group-hover:text-foreground transition-colors" />
          Go to Site
        </button>
        <button
          onClick={() => logout()}
          className="w-full flex items-center px-3 py-2.5 text-sm text-foreground hover:bg-muted transition-all duration-200 rounded-lg group"
        >
          <LogOut className="h-5 w-5 mr-3 text-muted-foreground group-hover:text-foreground transition-colors" />
          Sign Out
        </button>
      </div>
    </div>
  );
}