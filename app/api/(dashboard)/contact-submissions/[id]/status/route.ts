// app/api/contact-submissions/[id]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // In Next.js 15+, params is a Promise
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid ID format" },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { status } = body;
    
    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }
    
    // Validate status value
    const validStatuses = ["new", "in-progress", "completed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }
    
    // Update the submission status
    const updatedSubmission = await db
      .update(contactSubmissions)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(contactSubmissions.id, id))
      .returning();
    
    if (updatedSubmission.length === 0) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      submission: updatedSubmission[0] 
    });
  } catch (error) {
    console.error("Error updating submission status:", error);
    return NextResponse.json(
      { error: "Failed to update submission status" },
      { status: 500 }
    );
  }
}