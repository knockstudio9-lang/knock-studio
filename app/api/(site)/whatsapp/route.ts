// app/api/(site)/whatsapp/route.ts
import { NextResponse } from 'next/server';
import { getWhatsAppSettings } from '@/lib/site-settings';

export const dynamic = 'force-dynamic';

// Public: config for the floating WhatsApp button
export async function GET() {
  try {
    const settings = await getWhatsAppSettings();
    return NextResponse.json({ data: settings });
  } catch (error) {
    console.error('Error fetching WhatsApp button settings:', error);
    // Never break the page over a floating button
    return NextResponse.json({ data: { enabled: false } });
  }
}
