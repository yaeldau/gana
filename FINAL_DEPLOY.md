# 🚀 Gana - FINAL DEPLOYMENT STEPS

## ✅ COMPLETED:
- ✅ Neon Database Created & Migrated
- ✅ GitHub Repo: https://github.com/yaeldau/gana  
- ✅ All deployment configs created
- ✅ Code pushed and ready

---

## 🎯 OPTION 1: Netlify (Frontend) + Railway (Backend) - EASIEST

### Step 1: Deploy Frontend on Netlify (3 minutes)

**Method A - Import from GitHub (RECOMMENDED)**
1. Go to: https://app.netlify.com/start
2. Click "Import from Git" → "GitHub"
3. Select repository: `yaeldau/gana`
4. Click "Deploy site"
5. Done! You'll get: `https://gana-XXXXX.netlify.app`

**Method B - Using CLI (if you authorized)**
```bash
cd /Users/ydauber/Build/claude/gana/frontend
netlify deploy --prod
```

### Step 2: Deploy Backend on Railway (5 minutes)

1. Go to: https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose: `yaeldau/gana`
5. Click on the service → Settings:
   - **Root Directory**: `backend`
   - **Start Command**: `npm install && npx prisma generate && npm run build && npm start`
6. Go to "Variables" tab and add:
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_Zmyw0U8FYfgX@ep-divine-night-aj37gm05-pooler.c-3.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require
   JWT_SECRET=gana-production-secret-key-2026-secure
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   PORT=4000
   ALLOWED_ORIGINS=*
   ```
7. Deploy! You'll get: `https://gana-backend.up.railway.app`

### Step 3: Link Them Together

1. Copy your Railway backend URL
2. Go to Netlify → Site settings → Environment variables
3. Update `NEXT_PUBLIC_API_URL` with your Railway URL
4. Redeploy frontend
5. Go back to Railway → Update `ALLOWED_ORIGINS` with your Netlify URL
6. Redeploy backend

### ✅ DONE!

---

## 🎯 OPTION 2: All on Vercel (Simpler but may have backend limitations)

1. Go to: https://vercel.com/new
2. Import `yaeldau/gana`
3. Deploy twice:
   - Once with Root: `frontend` → Frontend URL
   - Once with Root: `backend` → Backend URL
4. Add environment variables in each deployment
5. Link them together

---

## 🎯 OPTION 3: Use Render (Alternative to Railway)

1. Go to: https://render.com
2. Create "Web Service" from GitHub
3. Same steps as Railway

---

## 🌐 YOUR URLs

Once deployed, you'll have:
- **Frontend**: `https://gana-XXXXX.netlify.app` or `https://gana-frontend.vercel.app`
- **Backend**: `https://gana-backend.up.railway.app` or similar
- **Database**: https://console.neon.tech/app/projects/silent-sea-32334355

---

## 💎 Custom Domain (Optional)

Buy domain (~$15/year):
- `gana.app`
- `gana.family`
- `mygana.com`

Then add in Netlify/Vercel settings.

---

## 💰 Cost

- Database (Neon): **FREE**
- Frontend (Netlify): **FREE**
- Backend (Railway): **~$5/month** (or FREE trial)

Total: **~$5/month** or **FREE** on trial

---

## 🆘 Need Help?

All the configs are ready in the repo. Just import and deploy!

Built with ❤️ by Yael Dauber
