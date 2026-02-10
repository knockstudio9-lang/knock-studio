// app/api/(site)/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactSubmissions } from '@/lib/db/schema';
import { formatWhatsAppMessage, generateWhatsAppUrl } from '@/lib/whatsapp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Validate required fields - only name, address, and service are required now
    const { name, address, service, area, budget, details } = formData;
    
    if (!name || !address || !service) {
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
      area: area || null,
      budget: budget || null,
      details: details || null,
    }).returning();
    
    // Format WhatsApp message
    const message = formatWhatsAppMessage({
      name,
      address,
      service,
      area: area || '',
      budget: budget || '',
      details: details || ''
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