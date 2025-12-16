/**
 * Utility functions for parsing Airbnb URLs and extracting dates
 */

export interface ParsedUrlData {
  checkin?: string;
  checkout?: string;
  placeId?: string;
  query?: string;
}

/**
 * Extract checkin and checkout dates from Airbnb URL
 */
export function parseAirbnbUrl(url: string): ParsedUrlData {
  const result: ParsedUrlData = {};
  
  try {
    const urlObj = new URL(url);
    
    // Extract checkin date
    const checkin = urlObj.searchParams.get('checkin');
    if (checkin) {
      result.checkin = checkin;
    }
    
    // Extract checkout date
    const checkout = urlObj.searchParams.get('checkout');
    if (checkout) {
      result.checkout = checkout;
    }
    
    // Extract place_id
    const placeId = urlObj.searchParams.get('place_id');
    if (placeId) {
      result.placeId = placeId;
    }
    
    // Extract query
    const query = urlObj.searchParams.get('query');
    if (query) {
      result.query = decodeURIComponent(query);
    }
  } catch (error) {
    console.error('Error parsing URL:', error);
  }
  
  return result;
}

/**
 * Generate date ranges for pricing calculations
 */
export function generateDateRanges(checkinDate: string) {
  const checkin = new Date(checkinDate);
  const ranges: {
    oneNight: Array<{ checkin: string; checkout: string; date: string }>;
    twoNights: Array<{ checkin: string; checkout: string; date: string }>;
    threeNights: Array<{ checkin: string; checkout: string; date: string }>;
    fourteenNights: { checkin: string; checkout: string; date: string };
    thirtyNights: { checkin: string; checkout: string; date: string };
  } = {
    oneNight: [],
    twoNights: [],
    threeNights: [],
    fourteenNights: { checkin: '', checkout: '', date: '' },
    thirtyNights: { checkin: '', checkout: '', date: '' }
  };
  
  // Format date as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  // Generate 7 days of 1-night stays
  for (let i = 0; i < 7; i++) {
    const startDate = new Date(checkin);
    startDate.setDate(checkin.getDate() + i);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);
    
    ranges.oneNight.push({
      checkin: formatDate(startDate),
      checkout: formatDate(endDate),
      date: formatDate(startDate)
    });
  }
  
  // Generate 7 days of 2-night stays
  for (let i = 0; i < 7; i++) {
    const startDate = new Date(checkin);
    startDate.setDate(checkin.getDate() + i);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 2);
    
    ranges.twoNights.push({
      checkin: formatDate(startDate),
      checkout: formatDate(endDate),
      date: formatDate(startDate)
    });
  }
  
  // Generate 7 days of 3-night stays
  for (let i = 0; i < 7; i++) {
    const startDate = new Date(checkin);
    startDate.setDate(checkin.getDate() + i);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 3);
    
    ranges.threeNights.push({
      checkin: formatDate(startDate),
      checkout: formatDate(endDate),
      date: formatDate(startDate)
    });
  }
  
  // Generate 14-night stay (1 time)
  const fourteenStart = new Date(checkin);
  const fourteenEnd = new Date(fourteenStart);
  fourteenEnd.setDate(fourteenStart.getDate() + 14);
  ranges.fourteenNights = {
    checkin: formatDate(fourteenStart),
    checkout: formatDate(fourteenEnd),
    date: formatDate(fourteenStart)
  };
  
  // Generate 30-night stay (1 time)
  const thirtyStart = new Date(checkin);
  const thirtyEnd = new Date(thirtyStart);
  thirtyEnd.setDate(thirtyStart.getDate() + 30);
  ranges.thirtyNights = {
    checkin: formatDate(thirtyStart),
    checkout: formatDate(thirtyEnd),
    date: formatDate(thirtyStart)
  };
  
  return ranges;
}

/**
 * Build Airbnb URL with specific checkin/checkout dates
 */
export function buildAirbnbUrl(baseUrl: string, checkin: string, checkout: string): string {
  try {
    const urlObj = new URL(baseUrl);
    // Set checkin and checkout dates (this will update existing or add new params)
    urlObj.searchParams.set('checkin', checkin);
    urlObj.searchParams.set('checkout', checkout);
    
    // Verify the dates were set correctly
    const finalCheckin = urlObj.searchParams.get('checkin');
    const finalCheckout = urlObj.searchParams.get('checkout');
    
    if (finalCheckin !== checkin || finalCheckout !== checkout) {
      console.warn(`URL date mismatch! Expected checkin: ${checkin}, got: ${finalCheckin}. Expected checkout: ${checkout}, got: ${finalCheckout}`);
    }
    
    return urlObj.toString();
  } catch (error) {
    console.error('Error building URL:', error);
    return baseUrl;
  }
}

