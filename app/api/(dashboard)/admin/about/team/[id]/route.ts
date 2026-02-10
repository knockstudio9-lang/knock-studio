// app/api/(dashboard)/admin/about/team/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// PUT - Update team member
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);
    const body = await request.json();

    const updatedMember = await db
      .update(teamMembers)
      .set({
        name: body.name,
        position: body.position,
        image: body.image,
        imagePublicId: body.imagePublicId,
        bio: body.bio,
        isFounder: body.isFounder,
        order: body.order,
        isActive: body.isActive,
        updatedAt: new Date(),
      })
      .where(eq(teamMembers.id, idNum))
      .returning();

    if (updatedMember.length === 0) {
      return NextResponse.json(
        { error: "Team member not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedMember[0],
    });
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json(
      { error: "Failed to update team member", success: false },
      { status: 500 }
    );
  }
}

// PATCH - Partial update (e.g., toggle active status)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);
    const body = await request.json();

    const updatedMember = await db
      .update(teamMembers)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(teamMembers.id, idNum))
      .returning();

    if (updatedMember.length === 0) {
      return NextResponse.json(
        { error: "Team member not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedMember[0],
    });
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json(
      { error: "Failed to update team member", success: false },
      { status: 500 }
    );
  }
}

// DELETE - Delete team member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);

    const deletedMember = await db
      .delete(teamMembers)
      .where(eq(teamMembers.id, idNum))
      .returning();

    if (deletedMember.length === 0) {
      return NextResponse.json(
        { error: "Team member not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting team member:", error);
    return NextResponse.json(
      { error: "Failed to delete team member", success: false },
      { status: 500 }
    );
  }
}