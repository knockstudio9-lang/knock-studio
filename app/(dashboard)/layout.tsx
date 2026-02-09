// app/dashboard/admin/layout.tsx
"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { useSession } from "@/components/providers/SessionProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole="admin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}