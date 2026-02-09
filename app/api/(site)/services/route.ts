// app/api/(site)/services/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { services } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET - Fetch all active services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('serviceId');

    // If serviceId is provided, fetch single service
    if (serviceId) {
      const service = await db
        .select()
        .from(services)
        .where(eq(services.serviceId, serviceId))
        .limit(1);

      if (service.length === 0) {
        return NextResponse.json(
          { error: 'Service not found', success: false },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: service[0],
      });
    }

    // Fetch all active services, ordered by order field
    const allServices = await db
      .select()
      .from(services)
      .where(eq(services.isActive, true))
      .orderBy(services.order);

    return NextResponse.json({
      success: true,
      data: allServices,
      count: allServices.length,
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services', success: false },
      { status: 500 }
    );
  }
}