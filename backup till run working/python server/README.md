# Airbnb Search API - Python Flask Server

A Flask API server that fetches Airbnb search results using the `pyairbnb` library.

## 🚀 Setup

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

Or if you're using a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Run the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### POST `/api/search`

Search Airbnb listings with full options.

**Request Body:**
```json
{
  "url": "https://www.airbnb.co.uk/s/Dubai-Marina-~-Dubai-~-United-Arab-Emirates/homes?...",
  "currency": "GBP",  // optional, defaults to GBP
  "language": "en",  // optional, defaults to en
  "proxy_url": ""    // optional, defaults to empty
}
```

**Response:**
```json
{
  "success": true,
  "timestamp": "2025-12-16T...",
  "url": "...",
  "currency": "GBP",
  "language": "en",
  "results_count": 50,
  "lowest_price": 109.0,
  "lowest_price_currency": "GBP",
  "prices_found": 50,
  "data": { ... }
}
```

**Note:** The API automatically extracts the lowest price from `price.unit.amount` in all results.

### POST `/api/search/simple`

Simplified search endpoint (only requires URL).

**Request Body:**
```json
{
  "url": "https://www.airbnb.co.uk/s/..."
}
```

**Response:**
```json
{
  "success": true,
  "lowest_price": 109.0,
  "lowest_price_currency": "GBP",
  "prices_found": 50,
  "results_count": 50,
  "data": { ... }
}
```

### GET `/api/health`

Health check endpoint.

### GET `/`

API information and available endpoints.

## 🔧 Usage Examples

### Using cURL

```bash
curl -X POST http://localhost:5000/api/search/simple \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.airbnb.co.uk/s/Dubai-Marina-~-Dubai-~-United-Arab-Emirates/homes?..."}'
```

### Using JavaScript/Fetch

```javascript
const response = await fetch('http://localhost:5000/api/search/simple', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://www.airbnb.co.uk/s/...'
  })
});

const data = await response.json();
console.log(data);
```

## 🔗 Integration with Next.js

To use this API from your Next.js frontend, you can create an API route or call it directly:

```typescript
// In your Next.js app
const response = await fetch('http://localhost:5000/api/search/simple', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: airbnbUrl })
});
```

## 📝 Notes

- The API uses CORS to allow requests from your Next.js frontend
- The server runs on port 5000 by default
- Make sure `pyairbnb` is properly installed and working
- The API fetches the live StaysSearch hash to match Airbnb's website

## 🐛 Troubleshooting

If you encounter issues:
1. Make sure Python 3.7+ is installed
2. Check that all dependencies are installed: `pip install -r requirements.txt`
3. Verify `pyairbnb` is working: `python -c "import pyairbnb; print('OK')"`
4. Check the Flask server logs for error messages

