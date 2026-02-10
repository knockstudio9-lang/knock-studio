// app/api/(dashboard)/admin/about/team/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const members = await db.select().from(teamMembers).orderBy(teamMembers.order);
    return NextResponse.json({ data: members });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
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
    const { name, position, image, imagePublicId, bio, isFounder, order, isActive } = body;

    if (!name || !position || !image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newMember = await db.insert(teamMembers).values({
      name,
      position,
      image,
      imagePublicId,
      bio,
      isFounder: isFounder || false,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    }).returning();

    return NextResponse.json({ data: newMember[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating team member:", error);
    return NextResponse.json(
      { error: "Failed to create team member" },
      { status: 500 }
    );
  }
}