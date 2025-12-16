# Deploying to Vercel

This guide will help you deploy the Airbnb Price Spy Next.js application to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Your project pushed to GitHub (recommended) or GitLab/Bitbucket

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "Add New Project"

2. **Import Your Repository**
   - Connect your GitHub account if not already connected
   - Select the repository containing your Next.js app
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `airbnb next` (if your repo is in a subfolder)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Set Environment Variables**
   Click "Environment Variables" and add:
   
   ```
   MONGODB_URI=mongodb+srv://wasif833:00123333@cluster0.6b8txmd.mongodb.net/airbnb-price-spy
   PYTHON_API_URL=http://34.171.9.155:5000
   ```
   
   **Important**: Make sure to add these for all environments (Production, Preview, Development)

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-project-name.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Navigate to Project Directory**
   ```bash
   cd "d:\desktop scripts\airbnb\airbnb next"
   ```

4. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project or create new
   - Set environment variables when prompted

5. **Set Environment Variables (if not set during deploy)**
   ```bash
   vercel env add MONGODB_URI
   vercel env add PYTHON_API_URL
   ```

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Environment Variables

Required environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `PYTHON_API_URL` | Python API server URL | `http://34.171.9.155:5000` |

## Important Notes

1. **MongoDB Atlas Network Access**
   - Make sure to whitelist Vercel's IP addresses in MongoDB Atlas
   - Or set MongoDB to allow access from anywhere (0.0.0.0/0) for development
   - Go to: MongoDB Atlas → Network Access → Add IP Address

2. **Python API CORS**
   - Ensure your Python API allows requests from your Vercel domain
   - Update CORS settings in `python server/app.py` if needed

3. **API Routes**
   - Next.js API routes will be available at `/api/*`
   - These run serverless on Vercel's edge network

4. **Build Time**
   - First deployment may take 2-5 minutes
   - Subsequent deployments are faster (incremental builds)

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Check for TypeScript errors: `npm run build` locally

### MongoDB Connection Issues
- Verify `MONGODB_URI` is set correctly in Vercel dashboard
- Check MongoDB Atlas Network Access settings
- Ensure database name in URI matches your actual database

### API Routes Not Working
- Check serverless function logs in Vercel dashboard
- Verify environment variables are set
- Check API route files are in `app/api/` directory

## Updating Your Deployment

After pushing changes to GitHub:
- Vercel will automatically redeploy (if auto-deploy is enabled)
- Or manually trigger deployment from Vercel dashboard
- Or run `vercel --prod` from CLI

## Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel will automatically provision SSL certificate

