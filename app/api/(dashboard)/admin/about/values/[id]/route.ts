/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/(dashboard)/admin/about/values/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { aboutValues } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    const updateData: any = {};

    // Only include fields that are provided in the request
    if (body.icon !== undefined) updateData.icon = body.icon;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    updateData.updatedAt = new Date();

    const updatedValue = await db
      .update(aboutValues)
      .set(updateData)
      .where(eq(aboutValues.id, id))
      .returning();

    if (updatedValue.length === 0) {
      return NextResponse.json({ error: "Value not found" }, { status: 404 });
    }

    return NextResponse.json({ data: updatedValue[0] });
  } catch (error) {
    console.error("Error updating about value:", error);
    return NextResponse.json(
      { error: "Failed to update about value" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const deletedValue = await db
      .delete(aboutValues)
      .where(eq(aboutValues.id, id))
      .returning();

    if (deletedValue.length === 0) {
      return NextResponse.json({ error: "Value not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Value deleted successfully" });
  } catch (error) {
    console.error("Error deleting about value:", error);
    return NextResponse.json(
      { error: "Failed to delete about value" },
      { status: 500 }
    );
  }
}