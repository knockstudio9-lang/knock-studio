// app/api/auth/session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-this-in-production"
);

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify JWT token
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Fetch fresh user data
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        image: users.image,
      })
      .from(users)
      .where(eq(users.id, payload.userId as number))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user,
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { message: "Invalid or expired session" },
      { status: 401 }
    );
  }
}