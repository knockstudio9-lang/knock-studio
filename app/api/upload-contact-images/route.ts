/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/upload-contact-images/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { sanitizeFolderName } from '@/lib/utils';

// Configuration
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_IMAGES = 5; // Maximum number of images per submission

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    let folder = formData.get('folder') as string || 'contact-submissions';
    
    // Sanitize the folder name to remove special characters
    folder = sanitizeFolderName(folder);
    
    // Validate files exist
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided', success: false },
        { status: 400 }
      );
    }

    // Validate number of files
    if (files.length > MAX_IMAGES) {
      return NextResponse.json(
        { 
          error: `Maximum ${MAX_IMAGES} images allowed per submission.`,
          success: false 
        },
        { status: 400 }
      );
    }

    // Validate each file
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { 
            error: `Invalid file type for ${file.name}. Only JPEG, PNG, WebP, and GIF are allowed.`,
            success: false 
          },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { 
            error: `File ${file.name} is too large. Maximum size is 5MB.`,
            success: false 
          },
          { status: 400 }
        );
      }
    }

    // Upload all files to Cloudinary
    const uploadPromises = files.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: folder,
            // Optimizations
            quality: 'auto',
            fetch_format: 'auto',
            // Generate thumbnails
            eager: [
              { width: 400, height: 300, crop: 'fill', quality: 'auto' },
              { width: 800, height: 600, crop: 'fill', quality: 'auto' }
            ],
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        ).end(buffer);
      });
    });

    const results: any[] = await Promise.all(uploadPromises);

    // Format response with all uploaded images
    const uploadedImages = results.map(result => ({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      thumbnail: result.eager?.[0]?.secure_url || result.secure_url,
    }));

    return NextResponse.json({ 
      success: true,
      images: uploadedImages,
      count: uploadedImages.length
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    
    // Handle specific Cloudinary errors
    if (error.http_code === 401) {
      return NextResponse.json(
        { 
          error: 'Cloudinary authentication failed. Please check your credentials.',
          success: false 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        error: error.message || 'Upload failed. Please try again.',
        success: false 
      },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove images from Cloudinary
export async function DELETE(request: NextRequest) {
  try {
    const { publicIds } = await request.json();

    if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
      return NextResponse.json(
        { error: 'No public IDs provided', success: false },
        { status: 400 }
      );
    }

    // Delete all images
    const deletePromises = publicIds.map(publicId => 
      cloudinary.uploader.destroy(publicId)
    );

    const results = await Promise.all(deletePromises);
    const successCount = results.filter(r => r.result === 'ok').length;

    return NextResponse.json({
      success: successCount === publicIds.length,
      message: `Successfully deleted ${successCount} of ${publicIds.length} images`,
      successCount,
      totalCount: publicIds.length
    });
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete images', success: false },
      { status: 500 }
    );
  }
}