// app/api/(dashboard)/admin/about/values/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { aboutValues } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

// GET - Fetch all about values
export async function GET() {
  try {
    const values = await db
      .select()
      .from(aboutValues)
      .orderBy(aboutValues.order, desc(aboutValues.createdAt));

    return NextResponse.json({
      success: true,
      data: values,
      count: values.length,
    });
  } catch (error) {
    console.error("Error fetching about values:", error);
    return NextResponse.json(
      { error: "Failed to fetch about values", success: false },
      { status: 500 }
    );
  }
}

// POST - Create new about value
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newValue = await db
      .insert(aboutValues)
      .values({
        icon: body.icon,
        title: body.title,
        description: body.description,
        order: body.order || 0,
        isActive: body.isActive ?? true,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newValue[0],
    });
  } catch (error) {
    console.error("Error creating about value:", error);
    return NextResponse.json(
      { error: "Failed to create about value", success: false },
      { status: 500 }
    );
  }
}