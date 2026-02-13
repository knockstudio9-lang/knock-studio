// components/dashboard/Header.tsx
"use client";

import { useSession } from "@/components/providers/SessionProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Moon, Sun, Home, LogOut, Bell, Mail, Clock, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: number;
  name: string;
  service: string;
  createdAt: Date;
  isRead: boolean;
}

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { user, logout } = useSession();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleGoHome = () => {
    router.push("/");
  };

  const handleSignOut = async () => {
    await logout();
  };

  // Fetch notifications (only for admin)
  useEffect(() => {
    if (user?.role === "admin") {
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.role]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications/contact-submissions");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PATCH",
      });

      if (response.ok) {
        // Update local state
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === notificationId ? { ...notif, isRead: true } : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/mark-all-read", {
        method: "PATCH",
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif => ({ ...notif, isRead: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    router.push("/dashboard/admin/contact-submissions");
    setIsOpen(false);
  };

  const getServiceLabel = (service: string) => {
    return service === "renovation" ? "Renovasi" : "Bangun Baru";
  };

  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container-custom px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle Button */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-md transition-colors hover:bg-muted"
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          >
            <Menu className="h-5 w-5 text-foreground" />
          </button>

          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-sm text-muted-foreground capitalize">
              {user?.role} Dashboard
            </p>
          </div>
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

          {/* Notification Dropdown - Only for Admin */}
          {user?.role === "admin" && (
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-2 rounded-md hover:bg-muted transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5 text-foreground" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-primary hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No new notifications
                  </div>
                ) : (
                  <ScrollArea className="h-[300px]">
                    {notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className={`flex flex-col items-start p-3 cursor-pointer ${
                          !notification.isRead ? "bg-muted/50" : ""
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start justify-between w-full gap-2">
                          <div className="flex items-start gap-2 flex-1">
                            <div className={`mt-1 ${!notification.isRead ? "text-primary" : "text-muted-foreground"}`}>
                              <Mail className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium leading-none mb-1">
                                New {getServiceLabel(notification.service)} Inquiry
                              </p>
                              <p className="text-sm text-muted-foreground truncate">
                                From: {notification.name}
                              </p>
                              <div className="flex items-center gap-1 mt-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(notification.createdAt), {
                                    addSuffix: true,
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                          {!notification.isRead && (
                            <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                          )}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </ScrollArea>
                )}
                {notifications.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="justify-center text-sm text-primary cursor-pointer"
                      onClick={() => {
                        router.push("/dashboard/admin/contact-submissions");
                        setIsOpen(false);
                      }}
                    >
                      View all submissions
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

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