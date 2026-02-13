// app/api/notifications/mark-all-read/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { contactSubmissions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function PATCH(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token and check if user is admin
    let userRole: string;
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { role: string };
      userRole = decoded.role;
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Only admins can mark notifications as read
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access only' },
        { status: 403 }
      );
    }

    // Update all submissions with status 'new' to 'in-progress'
    const result = await db
      .update(contactSubmissions)
      .set({ 
        status: 'in-progress',
        updatedAt: new Date()
      })
      .where(eq(contactSubmissions.status, 'new'))
      .returning({ id: contactSubmissions.id });

    return NextResponse.json({ 
      success: true,
      message: `${result.length} notifications marked as read`,
      count: result.length
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark all notifications as read' },
      { status: 500 }
    );
  }
}