# 🚀 Gana Deployment Guide

## Quick Deploy (10 minutes)

### ✅ Step 1: Database (COMPLETE)
Your Neon PostgreSQL database is ready!
- **Project ID**: silent-sea-32334355
- **Database**: neondb
- **Connection String**: 
  ```
  postgresql://neondb_owner:npg_Zmyw0U8FYfgX@ep-divine-night-aj37gm05-pooler.c-3.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require
  ```
- ✅ Migrations applied successfully

---

### Step 2: Deploy Backend to Vercel

#### Option A: Via Vercel CLI (Recommended)
1. Login to Vercel:
   ```bash
   vercel login
   ```

2. Deploy backend:
   ```bash
   cd /Users/ydauber/Build/claude/gana/backend
   vercel --prod
   ```

3. Set environment variables when prompted:
   - `DATABASE_URL`: (the connection string above)
   - `JWT_SECRET`: `gana-production-secret-key-2026-secure`
   - `JWT_EXPIRES_IN`: `7d`
   - `NODE_ENV`: `production`
   - `ALLOWED_ORIGINS`: `*` (will update after frontend deploy)

#### Option B: Via Vercel Web UI
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import" next to `yaeldau/gana`
3. Configure:
   - **Root Directory**: `backend`
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. Add Environment Variables:
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_Zmyw0U8FYfgX@ep-divine-night-aj37gm05-pooler.c-3.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require
   JWT_SECRET=gana-production-secret-key-2026-secure
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   ALLOWED_ORIGINS=*
   ```

5. Click "Deploy"
6. **Copy the backend URL** (e.g., `https://gana-backend.vercel.app`)

---

### Step 3: Deploy Frontend to Vercel

#### Option A: Via Vercel CLI
1. Deploy frontend:
   ```bash
   cd /Users/ydauber/Build/claude/gana/frontend
   vercel --prod
   ```

2. Set environment variables when prompted:
   - `NEXT_PUBLIC_API_URL`: (your backend URL from Step 2)
   - `NEXT_PUBLIC_ENV`: `production`

#### Option B: Via Vercel Web UI
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import" next to `yaeldau/gana` again
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

4. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=<your-backend-url-from-step-2>
   NEXT_PUBLIC_ENV=production
   ```

5. Click "Deploy"
6. **Your app is live!** 🎉

---

### Step 4: Update Backend CORS

Go back to Vercel backend settings:
1. Navigate to Settings → Environment Variables
2. Update `ALLOWED_ORIGINS` with your frontend URL
3. Redeploy the backend

---

## 🌐 Custom Domain (Optional)

### Option 1: gana.vercel.app (Free)
Your frontend will be available at `gana.vercel.app` by default.

### Option 2: Custom Domain
Unfortunately `gana.com` is likely taken. Here are alternatives:
- `gana.app` (~$15/year)
- `gana.family` (~$15/year)
- `mygana.com` (~$12/year)
- `gana-family.com` (~$12/year)

To add custom domain:
1. Purchase domain at [Namecheap](https://namecheap.com) or [Google Domains](https://domains.google)
2. In Vercel dashboard → Settings → Domains
3. Add your custom domain
4. Update DNS records as instructed by Vercel

---

## 🧪 Test Your Deployment

Once deployed, test these flows:
1. ✅ Open frontend URL
2. ✅ Click "Get Started" / "Register"
3. ✅ Create an account
4. ✅ Add a person to your family tree
5. ✅ View the family tree visualization

---

## 📊 Monitoring

- **Backend Logs**: Vercel Dashboard → Your Backend Project → Logs
- **Frontend Logs**: Vercel Dashboard → Your Frontend Project → Logs
- **Database**: [Neon Dashboard](https://console.neon.tech/app/projects/silent-sea-32334355)

---

## 🔐 Security Notes

- Store the DATABASE_URL and JWT_SECRET securely
- Never commit these to git
- Rotate JWT_SECRET periodically
- Update ALLOWED_ORIGINS to specific URLs in production

---

## 💰 Costs

- **Neon Database**: FREE (10GB storage, 3 compute hours/day)
- **Vercel Backend**: FREE (100GB bandwidth, serverless functions)
- **Vercel Frontend**: FREE (unlimited bandwidth on Pro plan)

**Total: $0/month** (on free tier)

---

Built with ❤️ by Yael Dauber
