// app/api/notifications/contact-submissions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { contactSubmissions } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
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

    // Only admins can view notifications
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access only' },
        { status: 403 }
      );
    }

    // Get recent submissions (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const submissions = await db
      .select({
        id: contactSubmissions.id,
        name: contactSubmissions.name,
        service: contactSubmissions.service,
        status: contactSubmissions.status,
        createdAt: contactSubmissions.createdAt,
      })
      .from(contactSubmissions)
      .orderBy(desc(contactSubmissions.createdAt))
      .limit(10);

    // Mark submissions with status 'new' as unread
    const notifications = submissions.map(submission => ({
      id: submission.id,
      name: submission.name,
      service: submission.service,
      createdAt: submission.createdAt,
      isRead: submission.status !== 'new',
    }));

    // Count unread notifications
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}