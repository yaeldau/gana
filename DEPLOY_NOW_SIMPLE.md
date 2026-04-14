# 🚀 Deploy Gana - Simple Web UI Method

## ✅ Already Completed:
- ✅ Neon Database Created & Migrated
- ✅ GitHub Repository: https://github.com/yaeldau/gana

---

## Step 1: Deploy Frontend (5 minutes)

1. **Open Vercel**: Go to [https://vercel.com/new](https://vercel.com/new)

2. **Import from GitHub**: 
   - Click "Import Git Repository"
   - Search for or select `yaeldau/gana`
   - Click "Import"

3. **Configure Frontend**:
   - **Project Name**: `gana-frontend`
   - **Root Directory**: `frontend` ← IMPORTANT! Click "Edit" and set this
   - **Framework Preset**: Next.js (should auto-detect)
   - Leave other settings as default

4. **Environment Variables**: Click "Add" and enter:
   ```
   NEXT_PUBLIC_API_URL=https://gana-backend.railway.app
   NEXT_PUBLIC_ENV=production
   ```
   *(We'll get the real backend URL in Step 2)*

5. **Deploy**: Click "Deploy" and wait ~2 minutes

6. **Copy URL**: After deployment, copy the URL (e.g., `https://gana-frontend.vercel.app`)

---

## Step 2: Deploy Backend (5 minutes)

### Option A: Railway (Recommended for Backend)

1. **Open Railway**: Go to [https://railway.app](https://railway.app)

2. **Sign up/Login** with GitHub

3. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `yaeldau/gana`

4. **Configure Settings**:
   - Click on the service
   - Go to "Settings"
   - **Root Directory**: Set to `backend`
   - **Start Command**: `npm run build && npm run start`
   - **Build Command**: `npm install && npx prisma generate`

5. **Environment Variables**:
   Click "Variables" tab and add:
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_Zmyw0U8FYfgX@ep-divine-night-aj37gm05-pooler.c-3.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require
   JWT_SECRET=gana-production-secret-key-2026-secure
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   PORT=4000
   ALLOWED_ORIGINS=https://gana-frontend.vercel.app
   ```

6. **Deploy**: Railway will auto-deploy

7. **Get URL**: Copy the Railway URL (e.g., `https://gana-backend.up.railway.app`)

8. **Update Frontend**: Go back to Vercel frontend settings and update `NEXT_PUBLIC_API_URL` with your Railway URL

### Option B: If Railway doesn't work - Use Render

1. **Open Render**: Go to [https://render.com](https://render.com)
2. Similar steps as Railway
3. Create "Web Service" from `yaeldau/gana` repository
4. Set root directory to `backend`
5. Add same environment variables
6. Deploy and get URL

---

## Step 3: Test Your App 🎉

1. Open your frontend URL (from Step 1)
2. The app should load!
3. Try creating an account
4. Add a family member

---

## 🌐 Custom Domain

Your app will be at:
- Frontend: `https://gana-frontend.vercel.app` or similar
- Backend: `https://gana-backend.up.railway.app` or similar

For a nice URL like `gana.app`:
1. Buy domain at Namecheap/Google Domains (~$15/year)
2. In Vercel → Settings → Domains → Add your domain
3. Update DNS as instructed

**Note**: `gana.com` is likely taken, try:
- `gana.app`
- `gana.family` 
- `mygana.com`

---

## 💰 Cost

- Neon Database: **FREE** (10GB)
- Vercel Frontend: **FREE** (unlimited)
- Railway Backend: **~$5/month** or FREE trial

---

## 🔗 Your Links

**Database**: https://console.neon.tech/app/projects/silent-sea-32334355

**GitHub**: https://github.com/yaeldau/gana

**Frontend** (after deploy): _____________

**Backend** (after deploy): _____________

---

Need help? I'm here to assist!
