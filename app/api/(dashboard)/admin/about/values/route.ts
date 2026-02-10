// app/api/(dashboard)/admin/about/values/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { aboutValues } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const values = await db.select().from(aboutValues).orderBy(aboutValues.order);
    return NextResponse.json({ data: values });
  } catch (error) {
    console.error("Error fetching about values:", error);
    return NextResponse.json(
      { error: "Failed to fetch about values" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { icon, title, description, order, isActive } = body;

    if (!icon || !title || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newValue = await db.insert(aboutValues).values({
      icon,
      title,
      description,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    }).returning();

    return NextResponse.json({ data: newValue[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating about value:", error);
    return NextResponse.json(
      { error: "Failed to create about value" },
      { status: 500 }
    );
  }
}