import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Search from '@/models/Search';
import { parseAirbnbUrl, generateDateRanges } from '@/lib/urlParser';

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

    // Parse URL to extract checkin date
    const parsedUrl = parseAirbnbUrl(url);
    const checkinDate = parsedUrl.checkin || null;
    
    // Generate date ranges if checkin date is available
    let pricingData = {
      oneNight: [],
      twoNights: [],
      threeNights: [],
      fourteenNights: { checkin: '', checkout: '', price: 0, date: '' },
      thirtyNights: { checkin: '', checkout: '', price: 0, date: '' }
    };
    
    if (checkinDate) {
      const dateRanges = generateDateRanges(checkinDate);
      pricingData = {
        oneNight: dateRanges.oneNight.map(range => ({ ...range, price: 0 })),
        twoNights: dateRanges.twoNights.map(range => ({ ...range, price: 0 })),
        threeNights: dateRanges.threeNights.map(range => ({ ...range, price: 0 })),
        fourteenNights: { ...dateRanges.fourteenNights, price: 0 },
        thirtyNights: { ...dateRanges.thirtyNights, price: 0 }
      };
    }

    const search = new Search({
      name,
      url,
      cleaningFee: cleaningFee || 0,
      checkinDate: checkinDate,
      checkoutDate: parsedUrl.checkout || null,
      lastRun: 'Never',
      status: 'idle',
      pricingData: pricingData
    });

    const savedSearch = await search.save();
    return NextResponse.json(savedSearch, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

