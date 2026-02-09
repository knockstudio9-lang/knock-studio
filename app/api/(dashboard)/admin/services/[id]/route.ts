// app/api/admin/services/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// PUT - Update service
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    const updatedService = await db
      .update(services)
      .set({
        icon: body.icon,
        title: body.title,
        description: body.description,
        duration: body.duration,
        features: body.features,
        bestFor: body.bestFor,
        image: body.image,
        imagePublicId: body.imagePublicId,
        order: body.order,
        isActive: body.isActive,
        updatedAt: new Date(),
      })
      .where(eq(services.id, id))
      .returning();

    if (updatedService.length === 0) {
      return NextResponse.json(
        { error: "Service not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedService[0],
    });
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Failed to update service", success: false },
      { status: 500 }
    );
  }
}

// PATCH - Partial update (e.g., toggle active status)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    const updatedService = await db
      .update(services)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(services.id, id))
      .returning();

    if (updatedService.length === 0) {
      return NextResponse.json(
        { error: "Service not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedService[0],
    });
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Failed to update service", success: false },
      { status: 500 }
    );
  }
}

// DELETE - Delete service
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const deletedService = await db
      .delete(services)
      .where(eq(services.id, id))
      .returning();

    if (deletedService.length === 0) {
      return NextResponse.json(
        { error: "Service not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Failed to delete service", success: false },
      { status: 500 }
    );
  }
}