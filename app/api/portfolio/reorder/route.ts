// app/api/portfolio/reorder/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PortfolioManager } from '@/lib/portfolio';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectOrders } = body;
    
    if (!projectOrders || !Array.isArray(projectOrders)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    // Update the order of projects
    await PortfolioManager.reorderProjects(projectOrders);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering projects:', error);
    return NextResponse.json(
      { error: 'Failed to reorder projects' },
      { status: 500 }
    );
  }
}