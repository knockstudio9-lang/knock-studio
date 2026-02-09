// app/api/(site)/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactSubmissions } from '@/lib/db/schema';
import { formatWhatsAppMessage, generateWhatsAppUrl } from '@/lib/whatsapp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Validate required fields
    const { name, address, service, area, budget } = formData;
    
    if (!name || !address || !service || !area || !budget) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Save to database
    const [submission] = await db.insert(contactSubmissions).values({
      name,
      address,
      service,
      area,
      budget,
    }).returning();
    
    // Format WhatsApp message
    const message = formatWhatsAppMessage(formData);
    
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