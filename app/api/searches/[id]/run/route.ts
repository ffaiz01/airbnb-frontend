import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Search from '@/models/Search';
import { buildAirbnbUrl } from '@/lib/urlParser';

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://34.171.9.155:5000';

/**
 * Fetch price from Python API for a specific date range
 */
async function fetchPriceFromPython(baseUrl: string, checkin: string, checkout: string): Promise<number | null> {
  try {
    const url = buildAirbnbUrl(baseUrl, checkin, checkout);
    
    // Debug logging
    console.log(`Fetching price for checkin: ${checkin}, checkout: ${checkout}`);
    console.log(`Built URL: ${url}`);
    
    const response = await fetch(`${PYTHON_API_URL}/api/search/simple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      console.error(`Failed to fetch price for ${checkin}-${checkout}:`, response.statusText);
      return null;
    }

    const data = await response.json();
    const price = data.lowest_price || null;
    console.log(`Received price for ${checkin}-${checkout}: ${price}`);
    return price;
  } catch (error) {
    console.error(`Error fetching price for ${checkin}-${checkout}:`, error);
    return null;
  }
}

/**
 * Run price fetching for a search
 * POST /api/searches/[id]/run
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const search = await (Search as any).findById(params.id);

    if (!search) {
      return NextResponse.json(
        { error: 'Search not found' },
        { status: 404 }
      );
    }

    // Update status to running
    search.status = 'running';
    search.lastRun = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    await (search as any).save();

    // Start fetching prices in the background
    // We'll update the database as prices come in
    const fetchPrices = async () => {
      try {
        const pricingData = search.pricingData || {
          oneNight: [],
          twoNights: [],
          threeNights: [],
          fourteenNights: { checkin: '', checkout: '', price: 0, date: '' },
          thirtyNights: { checkin: '', checkout: '', price: 0, date: '' }
        };

        // Fetch 1-night prices (7 dates)
        if (pricingData.oneNight && pricingData.oneNight.length > 0) {
          console.log(`Fetching 1-night prices. Total items: ${pricingData.oneNight.length}`);
          for (let i = 0; i < pricingData.oneNight.length; i++) {
            const item = pricingData.oneNight[i];
            console.log(`Item ${i}: checkin=${item.checkin}, checkout=${item.checkout}`);
            if (item.checkin && item.checkout) {
              const price = await fetchPriceFromPython(search.url, item.checkin, item.checkout);
              if (price !== null) {
                pricingData.oneNight[i].price = price;
                // Update database incrementally
                await (Search as any).findByIdAndUpdate(params.id, { pricingData }, { new: true });
                console.log(`Updated price for item ${i} to ${price}`);
              }
            } else {
              console.warn(`Item ${i} missing checkin or checkout dates`);
            }
          }
        }

        // Fetch 2-night prices (7 dates)
        if (pricingData.twoNights && pricingData.twoNights.length > 0) {
          for (let i = 0; i < pricingData.twoNights.length; i++) {
            const item = pricingData.twoNights[i];
            if (item.checkin && item.checkout) {
              const price = await fetchPriceFromPython(search.url, item.checkin, item.checkout);
              if (price !== null) {
                pricingData.twoNights[i].price = price;
                await (Search as any).findByIdAndUpdate(params.id, { pricingData }, { new: true });
              }
            }
          }
        }

        // Fetch 3-night prices (7 dates)
        if (pricingData.threeNights && pricingData.threeNights.length > 0) {
          for (let i = 0; i < pricingData.threeNights.length; i++) {
            const item = pricingData.threeNights[i];
            if (item.checkin && item.checkout) {
              const price = await fetchPriceFromPython(search.url, item.checkin, item.checkout);
              if (price !== null) {
                pricingData.threeNights[i].price = price;
                await (Search as any).findByIdAndUpdate(params.id, { pricingData }, { new: true });
              }
            }
          }
        }

        // Fetch 14-night price
        if (pricingData.fourteenNights && pricingData.fourteenNights.checkin) {
          const price = await fetchPriceFromPython(
            search.url,
            pricingData.fourteenNights.checkin,
            pricingData.fourteenNights.checkout
          );
          if (price !== null) {
            pricingData.fourteenNights.price = price;
            await (Search as any).findByIdAndUpdate(params.id, { pricingData }, { new: true });
          }
        }

        // Fetch 30-night price
        if (pricingData.thirtyNights && pricingData.thirtyNights.checkin) {
          const price = await fetchPriceFromPython(
            search.url,
            pricingData.thirtyNights.checkin,
            pricingData.thirtyNights.checkout
          );
          if (price !== null) {
            pricingData.thirtyNights.price = price;
            await (Search as any).findByIdAndUpdate(params.id, { pricingData }, { new: true });
          }
        }

        // Update status to completed
        await (Search as any).findByIdAndUpdate(params.id, { status: 'completed' }, { new: true });
      } catch (error) {
        console.error('Error in background price fetching:', error);
        await (Search as any).findByIdAndUpdate(params.id, { status: 'error' }, { new: true });
      }
    };

    // Start fetching in background (don't await)
    fetchPrices();

    // Return immediately with running status
    return NextResponse.json({
      success: true,
      message: 'Price fetching started',
      status: 'running'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

