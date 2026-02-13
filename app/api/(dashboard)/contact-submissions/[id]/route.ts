// app/api/contact-submissions/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactSubmissions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import cloudinary from '@/lib/cloudinary';

// DELETE a contact submission by ID - now includes image cleanup
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // In Next.js 15+, params is a Promise and must be awaited
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid submission ID' },
        { status: 400 }
      );
    }
    
    // Check if submission exists and get image public IDs
    const [existingSubmission] = await db
      .select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.id, id));
    
    if (!existingSubmission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }
    
    // Delete images from Cloudinary if they exist
    if (existingSubmission.imagePublicIds && Array.isArray(existingSubmission.imagePublicIds) && existingSubmission.imagePublicIds.length > 0) {
      try {
        const deletePromises = existingSubmission.imagePublicIds.map((publicId: string) => 
          cloudinary.uploader.destroy(publicId)
        );
        await Promise.all(deletePromises);
        console.log(`Deleted ${existingSubmission.imagePublicIds.length} images from Cloudinary`);
      } catch (cloudinaryError) {
        console.error('Error deleting images from Cloudinary:', cloudinaryError);
        // Continue with submission deletion even if Cloudinary deletion fails
      }
    }
    
    // Delete submission from database
    await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
    
    return NextResponse.json({ 
      success: true,
      message: 'Submission and associated images deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting contact submission:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact submission' },
      { status: 500 }
    );
  }
}