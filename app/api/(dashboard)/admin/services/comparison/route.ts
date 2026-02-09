// app/api/admin/services/comparison/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serviceComparisonFeatures } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

// GET - Fetch all comparison features
export async function GET() {
  try {
    const features = await db
      .select()
      .from(serviceComparisonFeatures)
      .orderBy(serviceComparisonFeatures.order, desc(serviceComparisonFeatures.createdAt));

    return NextResponse.json({
      success: true,
      data: features,
      count: features.length,
    });
  } catch (error) {
    console.error("Error fetching comparison features:", error);
    return NextResponse.json(
      { error: "Failed to fetch comparison features", success: false },
      { status: 500 }
    );
  }
}

// POST - Create new comparison feature
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newFeature = await db
      .insert(serviceComparisonFeatures)
      .values({
        feature: body.feature,
        renovation: body.renovation ?? false,
        visualization: body.visualization ?? false,
        consultation: body.consultation ?? false,
        estimation: body.estimation ?? false,
        execution: body.execution ?? false,
        order: body.order,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newFeature[0],
    });
  } catch (error) {
    console.error("Error creating comparison feature:", error);
    return NextResponse.json(
      { error: "Failed to create comparison feature", success: false },
      { status: 500 }
    );
  }
}