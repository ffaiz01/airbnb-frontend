# Airbnb Price Spy - Next.js Version

This is the Next.js version of the Airbnb Price Spy application with MongoDB integration.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://wasif833:00123333@cluster0.6b8txmd.mongodb.net/airbnb-price-spy
```

### 3. Copy UI Components and Hooks

You need to copy the UI components and hooks from the original project:

**From:** `airbnb-price-spy-main/src/components/ui/`  
**To:** `airbnb next/components/ui/`

**From:** `airbnb-price-spy-main/src/hooks/`  
**To:** `airbnb next/hooks/`

**From:** `airbnb-price-spy-main/src/components/` (remaining components)  
**To:** `airbnb next/components/`

Components to copy:
- `AddSearchModal.tsx`
- `ScheduleModal.tsx`
- `SearchBlock.tsx`
- `ShortTermTable.tsx`
- `LongTermPricing.tsx`
- `FilterToggles.tsx`

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
airbnb next/
├── app/
│   ├── api/
│   │   └── searches/          # API routes for MongoDB
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   └── providers.tsx          # React Query provider
├── components/
│   ├── ui/                    # shadcn/ui components (copy from original)
│   └── ...                    # App components
├── hooks/                     # Custom hooks (copy from original)
├── lib/
│   ├── api.ts                 # API client functions
│   ├── mongodb.ts             # MongoDB connection
│   └── utils.ts               # Utility functions
├── models/
│   └── Search.ts              # MongoDB model
└── package.json
```

## 🗄️ Database

- **Database Name:** `airbnb-price-spy`
- **Collection Name:** `searches`
- **Fields:**
  - `name` (String, required)
  - `url` (String, required)
  - `cleaningFee` (Number, default: 0)
  - `lastRun` (String, default: "Never")
  - `createdAt` (Date, auto)
  - `updatedAt` (Date, auto)

## 🔧 Features

- ✅ Next.js 14 with App Router
- ✅ TypeScript
- ✅ MongoDB integration
- ✅ API routes for CRUD operations
- ✅ React Query for data fetching
- ✅ Tailwind CSS + shadcn/ui
- ✅ Responsive design

## 📝 API Endpoints

- `GET /api/searches` - Get all searches
- `POST /api/searches` - Create new search
- `GET /api/searches/[id]` - Get single search
- `PUT /api/searches/[id]` - Update search
- `DELETE /api/searches/[id]` - Delete search

## 🎯 Next Steps

1. Copy all UI components from the original project
2. Copy hooks from the original project
3. Test the MongoDB connection
4. Add more features as needed

