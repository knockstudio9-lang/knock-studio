// app/api/admin/services/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

// GET - Fetch all services (including inactive)
export async function GET() {
  try {
    const allServices = await db
      .select()
      .from(services)
      .orderBy(services.order, desc(services.createdAt));

    return NextResponse.json({
      success: true,
      data: allServices,
      count: allServices.length,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services", success: false },
      { status: 500 }
    );
  }
}

// POST - Create new service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newService = await db
      .insert(services)
      .values({
        serviceId: body.serviceId,
        icon: body.icon,
        title: body.title,
        description: body.description,
        duration: body.duration,
        features: body.features,
        bestFor: body.bestFor,
        image: body.image,
        imagePublicId: body.imagePublicId,
        order: body.order,
        isActive: body.isActive ?? true,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newService[0],
    });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Failed to create service", success: false },
      { status: 500 }
    );
  }
}