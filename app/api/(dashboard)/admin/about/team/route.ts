// app/api/(dashboard)/admin/about/team/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

// GET - Fetch all team members
export async function GET() {
  try {
    const members = await db
      .select()
      .from(teamMembers)
      .orderBy(teamMembers.order, desc(teamMembers.createdAt));

    return NextResponse.json({
      success: true,
      data: members,
      count: members.length,
    });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members", success: false },
      { status: 500 }
    );
  }
}

// POST - Create new team member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newMember = await db
      .insert(teamMembers)
      .values({
        name: body.name,
        position: body.position,
        image: body.image,
        imagePublicId: body.imagePublicId,
        bio: body.bio,
        isFounder: body.isFounder || false,
        order: body.order || 0,
        isActive: body.isActive ?? true,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newMember[0],
    });
  } catch (error) {
    console.error("Error creating team member:", error);
    return NextResponse.json(
      { error: "Failed to create team member", success: false },
      { status: 500 }
    );
  }
}