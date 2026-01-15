import { NextRequest, NextResponse } from 'next/server';

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://34.171.9.155:5000';

/**
 * Run price fetching for a search
 * POST /api/searches/[id]/run
 * 
 * This endpoint delegates to the Python scheduler which will:
 * 1. Regenerate dates from today
 * 2. Update database with new dates (prices = 0)
 * 3. Fetch prices incrementally
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchId = params.id;

    // Call Python API to trigger scheduler
    const response = await fetch(`${PYTHON_API_URL}/api/searches/${searchId}/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to trigger search' }));
      return NextResponse.json(
        { error: errorData.error || 'Failed to trigger search' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: data.message || 'Price fetching started',
      status: 'running'
    });
  } catch (error: any) {
    console.error('Error triggering search:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to trigger search' },
      { status: 500 }
    );
  }
}

