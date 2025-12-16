export interface PricingDataItem {
  checkin: string;
  checkout: string;
  price: number;
  date: string;
}

export interface PricingData {
  oneNight: PricingDataItem[];
  twoNights: PricingDataItem[];
  threeNights: PricingDataItem[];
  fourteenNights: PricingDataItem;
  thirtyNights: PricingDataItem;
}

export interface SearchData {
  _id?: string;
  id?: string;
  name: string;
  url: string;
  cleaningFee: number;
  checkinDate?: string | null;
  checkoutDate?: string | null;
  lastRun: string;
  status?: 'idle' | 'running' | 'completed' | 'error';
  pricingData?: PricingData;
  createdAt?: string;
  updatedAt?: string;
}

const API_BASE_URL = '/api';

// GET all searches
export const getSearches = async (): Promise<SearchData[]> => {
  const response = await fetch(`${API_BASE_URL}/searches`);
  if (!response.ok) {
    throw new Error('Failed to fetch searches');
  }
  const data = await response.json();
  // Map _id to id for compatibility with existing code
  return data.map((search: SearchData) => ({
    ...search,
    id: search._id || search.id,
  }));
};

// POST create new search
export const createSearch = async (searchData: {
  name: string;
  url: string;
  cleaningFee: number;
}): Promise<SearchData> => {
  const response = await fetch(`${API_BASE_URL}/searches`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(searchData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create search');
  }
  const data = await response.json();
  return {
    ...data,
    id: data._id || data.id,
  };
};

// PUT update search
export const updateSearch = async (
  id: string,
  searchData: { name: string; url: string; cleaningFee?: number }
): Promise<SearchData> => {
  const response = await fetch(`${API_BASE_URL}/searches/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(searchData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update search');
  }
  const data = await response.json();
  return {
    ...data,
    id: data._id || data.id,
  };
};

// DELETE search
export const deleteSearch = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/searches/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete search');
  }
};

// POST run search (fetch prices)
export const runSearch = async (id: string): Promise<{ success: boolean; message: string; status: string }> => {
  const response = await fetch(`${API_BASE_URL}/searches/${id}/run`, {
    method: 'POST',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to run search');
  }
  return await response.json();
};

