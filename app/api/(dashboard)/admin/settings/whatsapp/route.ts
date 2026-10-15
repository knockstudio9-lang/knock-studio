// app/api/(dashboard)/admin/settings/whatsapp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getWhatsAppSettings, updateWhatsAppSettings } from '@/lib/site-settings';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
);

async function isAdmin(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const settings = await getWhatsAppSettings();
    return NextResponse.json({ data: settings });
  } catch (error) {
    console.error('Error fetching WhatsApp settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch WhatsApp settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const updated = await updateWhatsAppSettings(data);
    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('Error updating WhatsApp settings:', error);
    return NextResponse.json(
      { error: 'Failed to update WhatsApp settings' },
      { status: 500 }
    );
  }
}
