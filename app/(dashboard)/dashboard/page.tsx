// app/(dashboard)/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-6">
        Admin Dashboard
      </h1>
    </div>
  );
}