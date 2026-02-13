// app/api/(site)/contact/route.ts - Updated to handle images
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactSubmissions } from '@/lib/db/schema';
import { formatWhatsAppMessage, generateWhatsAppUrl } from '@/lib/whatsapp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Validate required fields - only name, address, and service are required now
    const { name, address, service, area, budget, details, images, imagePublicIds } = formData;
    
    if (!name || !address || !service) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate images and publicIds match if provided
    if (images && imagePublicIds && images.length !== imagePublicIds.length) {
      return NextResponse.json(
        { error: 'Images and publicIds arrays must have the same length' },
        { status: 400 }
      );
    }
    
    // Save to database
    const [submission] = await db.insert(contactSubmissions).values({
      name,
      address,
      service,
      area: area || null,
      budget: budget || null,
      details: details || null,
      images: images || [],
      imagePublicIds: imagePublicIds || [],
    }).returning();
    
    // Format WhatsApp message
    const message = formatWhatsAppMessage({
      name,
      address,
      service,
      area: area || '',
      budget: budget || '',
      details: details || '',
      images: images || []
    });
    
    // Get WhatsApp number from environment variables
    const whatsappNumber = process.env.WHATSAPP_NUMBER || '628123456789'; // Default to a test number
    
    // Generate WhatsApp URL
    const whatsappUrl = generateWhatsAppUrl(whatsappNumber, message);
    
    return NextResponse.json({
      success: true,
      submission,
      whatsappUrl,
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}