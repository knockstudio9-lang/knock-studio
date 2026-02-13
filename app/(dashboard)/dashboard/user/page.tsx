// app/(dashboard)/dashboard/user/page.tsx - Clean version (recommended)
"use client";

import { useSession } from "@/components/providers/SessionProvider";
import Image from "next/image";

export default function UserDashboardPage() {
  const { user } = useSession();

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-8rem)] bg-background">
      {/* Title */}
      <div className="pt-20 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-foreground text-center">
          Under <span className="font-bold">Construction</span>
        </h1>
        <p className="text-center text-muted-foreground mt-4 text-sm md:text-base max-w-md mx-auto">
          We're building something amazing for you, {user?.name}. Stay tuned!
        </p>
      </div>
      
      {/* Image Container */}
      <div className="flex-1 flex items-center justify-center w-full px-4 py-8">
        <div className="relative w-full max-w-md md:max-w-lg lg:max-w-2xl aspect-square">
          <Image
            src="/under/under-construct.png"
            alt="Under Construction"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </div>

      {/* Optional: Coming Soon Message */}
      <div className="pb-12 px-4 text-center">
        <p className="text-muted-foreground text-sm">
          Expected completion: <span className="font-medium text-foreground">Coming Soon</span>
        </p>
      </div>
    </div>
  );
}