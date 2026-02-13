// app/api/contact-submissions/bulk-delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/db/schema";
import { inArray } from "drizzle-orm";
import cloudinary from '@/lib/cloudinary';

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
    
    // Get all submissions to find their images
    const submissionsToDelete = await db
      .select()
      .from(contactSubmissions)
      .where(inArray(contactSubmissions.id, numericIds));
    
    // Collect all image public IDs
    const allImagePublicIds: string[] = [];
    submissionsToDelete.forEach(submission => {
      if (submission.imagePublicIds && Array.isArray(submission.imagePublicIds)) {
        allImagePublicIds.push(...submission.imagePublicIds);
      }
    });
    
    // Delete images from Cloudinary if they exist
    if (allImagePublicIds.length > 0) {
      try {
        const deletePromises = allImagePublicIds.map(publicId => 
          cloudinary.uploader.destroy(publicId)
        );
        await Promise.all(deletePromises);
        console.log(`Deleted ${allImagePublicIds.length} images from Cloudinary`);
      } catch (cloudinaryError) {
        console.error('Error deleting images from Cloudinary:', cloudinaryError);
        // Continue with submission deletion even if Cloudinary deletion fails
      }
    }
    
    // Delete the submissions from database
    const result = await db
      .delete(contactSubmissions)
      .where(inArray(contactSubmissions.id, numericIds))
      .returning({ id: contactSubmissions.id });
    
    return NextResponse.json({ 
      success: true,
      deletedCount: result.length,
      imagesDeleted: allImagePublicIds.length
    });
  } catch (error) {
    console.error("Error deleting submissions:", error);
    return NextResponse.json(
      { error: "Failed to delete submissions" },
      { status: 500 }
    );
  }
}