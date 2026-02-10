/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Package,
  Info
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
      name: "About",
      href: "/dashboard/admin/about",
      icon: Info,
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
    <div className="w-64 bg-gradient-to-b from-card to-card/50 border-r border-border/50 backdrop-blur-sm h-full flex flex-col">
      {/* Logo Section */}
      <div className="p-6 pb-4">
        <Link 
          href={userRole === "admin" ? "/dashboard/admin" : "/dashboard/user"} 
          className="flex items-center group"
        >
          {theme === "dark" ? (
            <Image
              src="/logo.gif" 
              alt="Logo" 
              width={300} 
              height={20}
              className="h-auto w-20 transition-transform duration-300 group-hover:scale-105" 
              priority
            />
          ) : (
            <Image
              src="/logo-black.gif" 
              alt="Logo" 
              width={300} 
              height={20}
              className="h-auto w-20 transition-transform duration-300 group-hover:scale-105" 
              priority
            />
          )}
        </Link>
        <div className="mt-3 px-3 py-2 bg-secondary/10 border border-secondary/20">
          <p className="text-xs text-foreground font-semibold uppercase tracking-widest">
            {userRole === "admin" ? "Admin Panel" : "User Portal"}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        <div className="space-y-1 px-3">
          {navigation.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            // Category header (non-clickable)
            if (item.isCategory) {
              return (
                <div 
                  key={item.name}
                  className="flex items-center px-3 py-3 mt-6 mb-2"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-secondary" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-border/50 ml-3" />
                </div>
              );
            }

            // Sub-items (indented)
            if (item.isSubItem) {
              return (
                <Link
                  key={item.name}
                  href={item.href || "#"}
                  className={`flex items-center gap-3 pl-8 pr-3 py-2.5 text-sm transition-all duration-200 group relative overflow-hidden ${
                    isActive 
                      ? "bg-secondary/15 text-secondary font-semibold shadow-sm" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-secondary to-secondary/50 rounded-r-full" />
                  )}
                  
                  {/* Hover background effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isActive ? 'opacity-100' : ''}`} />
                  
                  <Icon className={`h-4 w-4 transition-all duration-200 relative z-10 ${
                    isActive ? "text-secondary" : "text-muted-foreground group-hover:text-foreground group-hover:scale-110"
                  }`} />
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            }

            // Regular items
            return (
              <Link
                key={item.name}
                href={item.href || "#"}
                className={`flex items-center gap-3 px-3 py-3 text-sm  transition-all duration-200 group relative overflow-hidden ${
                  isActive 
                    ? "bg-secondary/15 text-secondary font-semibold shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-secondary to-secondary/50" />
                )}
                
                {/* Hover background effect */}
                <div className={`absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isActive ? 'opacity-100' : ''}`} />
                
                <Icon className={`h-5 w-5 transition-all duration-200 relative z-10 ${
                  isActive ? "text-secondary" : "text-muted-foreground group-hover:text-foreground group-hover:scale-110"
                }`} />
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-border/50 p-3 space-y-1 bg-card/80 backdrop-blur-sm">
        <Link href="/" passHref>
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <Home className="h-5 w-5 transition-all duration-200 group-hover:scale-110 relative z-10" />
            <span className="relative z-10">Go to Site</span>
          </button>
        </Link>
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all duration-200 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <LogOut className="h-5 w-5 transition-all duration-200 group-hover:scale-110 relative z-10" />
          <span className="relative z-10">Sign Out</span>
        </button>
      </div>
    </div>
  );
}