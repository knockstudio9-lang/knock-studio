// app/api/contact-submissions/bulk-delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/db/schema";
import { inArray } from "drizzle-orm";

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { ids } = body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Valid IDs array is required" },
        { status: 400 }
      );
    }
    
    // Validate all IDs are numbers
    const validIds = ids.every(id => !isNaN(parseInt(id)));
    if (!validIds) {
      return NextResponse.json(
        { error: "All IDs must be valid numbers" },
        { status: 400 }
      );
    }
    
    // Convert to numbers
    const numericIds = ids.map(id => parseInt(id));
    
    // Delete the submissions
    const result = await db
      .delete(contactSubmissions)
      .where(inArray(contactSubmissions.id, numericIds))
      .returning({ id: contactSubmissions.id });
    
    return NextResponse.json({ 
      success: true,
      deletedCount: result.length 
    });
  } catch (error) {
    console.error("Error deleting submissions:", error);
    return NextResponse.json(
      { error: "Failed to delete submissions" },
      { status: 500 }
    );
  }
}