import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Search from '@/models/Search';

// GET single search by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const search = await Search.findById(params.id);
    if (!search) {
      return NextResponse.json(
        { error: 'Search not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(search);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update search
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { name, url, cleaningFee } = await request.json();

    const search = await Search.findByIdAndUpdate(
      params.id,
      { name, url, cleaningFee },
      { new: true, runValidators: true }
    );

    if (!search) {
      return NextResponse.json(
        { error: 'Search not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(search);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE search
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const search = await Search.findByIdAndDelete(params.id);

    if (!search) {
      return NextResponse.json(
        { error: 'Search not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Search deleted successfully',
      search
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

