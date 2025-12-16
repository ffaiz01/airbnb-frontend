import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Search from '@/models/Search';

// GET all searches
export async function GET() {
  try {
    await connectDB();
    const searches = await Search.find().sort({ createdAt: -1 });
    return NextResponse.json(searches);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create new search
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { name, url, cleaningFee } = await request.json();

    // Validation
    if (!name || !url) {
      return NextResponse.json(
        { error: 'Name and URL are required' },
        { status: 400 }
      );
    }

    const search = new Search({
      name,
      url,
      cleaningFee: cleaningFee || 0,
      lastRun: 'Never'
    });

    const savedSearch = await search.save();
    return NextResponse.json(savedSearch, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

