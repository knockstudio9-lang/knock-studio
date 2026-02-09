// app/api/admin/services/comparison/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serviceComparisonFeatures } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// PUT - Update comparison feature
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);
    const body = await request.json();

    const updatedFeature = await db
      .update(serviceComparisonFeatures)
      .set({
        feature: body.feature,
        renovation: body.renovation,
        visualization: body.visualization,
        consultation: body.consultation,
        estimation: body.estimation,
        execution: body.execution,
        order: body.order,
        updatedAt: new Date(),
      })
      .where(eq(serviceComparisonFeatures.id, idNum))
      .returning();

    if (updatedFeature.length === 0) {
      return NextResponse.json(
        { error: "Comparison feature not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedFeature[0],
    });
  } catch (error) {
    console.error("Error updating comparison feature:", error);
    return NextResponse.json(
      { error: "Failed to update comparison feature", success: false },
      { status: 500 }
    );
  }
}

// DELETE - Delete comparison feature
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);

    const deletedFeature = await db
      .delete(serviceComparisonFeatures)
      .where(eq(serviceComparisonFeatures.id, idNum))
      .returning();

    if (deletedFeature.length === 0) {
      return NextResponse.json(
        { error: "Comparison feature not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Comparison feature deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comparison feature:", error);
    return NextResponse.json(
      { error: "Failed to delete comparison feature", success: false },
      { status: 500 }
    );
  }
}