// app/api/(site)/services/comparison/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { serviceComparisonFeatures } from '@/lib/db/schema';

// GET - Fetch all comparison features
export async function GET() {
  try {
    const features = await db
      .select()
      .from(serviceComparisonFeatures)
      .orderBy(serviceComparisonFeatures.order);

    return NextResponse.json({
      success: true,
      data: features,
      count: features.length,
    });
  } catch (error) {
    console.error('Error fetching comparison features:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comparison features', success: false },
      { status: 500 }
    );
  }
}