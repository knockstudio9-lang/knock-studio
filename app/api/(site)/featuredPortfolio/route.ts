// app/api/(site)/featuredPortfolio/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

// Cache the response for 60 seconds
export const revalidate = 60;

export async function GET() {
  try {
    // Fetch featured projects that are published, ordered by the 'order' field
    const featuredProjects = await db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.featured, true),
          eq(projects.status, 'published')
        )
      )
      .orderBy(desc(projects.order))
      .limit(4); // Limit to 4 projects for the homepage

    return NextResponse.json(featuredProjects);
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured projects' },
      { status: 500 }
    );
  }
}