// app/api/(dashboard)/contact-submissions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactSubmissions } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET all contact submissions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let submissions;
    
    if (status) {
      submissions = await db
        .select()
        .from(contactSubmissions)
        .where(eq(contactSubmissions.status, status))
        .orderBy(desc(contactSubmissions.createdAt));
    } else {
      submissions = await db
        .select()
        .from(contactSubmissions)
        .orderBy(desc(contactSubmissions.createdAt));
    }
    
    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact submissions' },
      { status: 500 }
    );
  }
}

// POST a new contact submission (for admin use)
export async function POST(request: NextRequest) {
  try {
    const { name, address, service, area, budget, status, notes } = await request.json();
    
    if (!name || !address || !service || !area || !budget) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const [submission] = await db.insert(contactSubmissions).values({
      name,
      address,
      service,
      area,
      budget,
      status: status || 'new',
      notes: notes || null,
    }).returning();
    
    return NextResponse.json({ submission });
  } catch (error) {
    console.error('Error creating contact submission:', error);
    return NextResponse.json(
      { error: 'Failed to create contact submission' },
      { status: 500 }
    );
  }
}