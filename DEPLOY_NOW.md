# 🚀 Deploy Gana to Production NOW

Follow these steps to get Gana live on the internet in ~10 minutes!

## Step 1: Create Neon Database (2 minutes)

1. Go to https://neon.tech
2. Sign up with GitHub (free)
3. Click "Create Project"
   - Name: `Gana`
   - Region: Choose closest to you
4. Click "Create Project"
5. **Copy the connection string** (looks like `postgresql://user:pass@host/neon`)
   - Save it - you'll need it for Railway!

## Step 2: Deploy Backend to Railway (3 minutes)

1. Go to https://railway.app
2. Sign up with GitHub (free)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `gana-api` repository
5. Click "Add variables":
   ```
   DATABASE_URL = <paste your Neon connection string>
   JWT_SECRET = <click "Generate" or paste: gana-production-secret-key-2026>
   JWT_EXPIRES_IN = 7d
   NODE_ENV = production
   ALLOWED_ORIGINS = https://your-frontend-url.vercel.app
   PORT = 4000
   ```
6. Click "Deploy"
7. Wait 2-3 minutes for deploy
8. **Copy your Railway URL** (like `https://gana-api-production.up.railway.app`)

### Run Database Migrations

Once deployed, in Railway:
1. Click on your service
2. Go to "Settings" → "Deploy Command"
3. Add: `npx prisma migrate deploy && npm start`
4. Redeploy

## Step 3: Deploy Frontend to Vercel (2 minutes)

1. Go to https://vercel.com
2. Sign up with GitHub (free)
3. Click "Add New..." → "Project"
4. Select `gana-web` repository
5. Configure:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Environment Variables:
     ```
     NEXT_PUBLIC_API_URL = <paste your Railway backend URL>
     NEXT_PUBLIC_ENV = production
     ```
6. Click "Deploy"
7. Wait 2-3 minutes
8. **Copy your Vercel URL** (like `https://gana-web.vercel.app`)

### Update Backend CORS

Go back to Railway:
1. Update `ALLOWED_ORIGINS` variable
2. Paste your Vercel URL
3. Redeploy

## Step 4: Test Your App! (1 minute)

1. Open your Vercel URL in browser
2. Click "Get Started"
3. Create an account
4. Add your first family member
5. 🎉 **You're live!**

## Step 5: Custom Domain (Optional)

### Vercel (Frontend)
1. In Vercel dashboard → Settings → Domains
2. Add `gana.app` (or your domain)
3. Update DNS:
   - Type: CNAME
   - Name: www (or @)
   - Value: cname.vercel-dns.com

### Railway (Backend)
1. In Railway → Settings → Domains
2. Add `api.gana.app`
3. Update DNS:
   - Type: CNAME
   - Name: api
   - Value: Your Railway domain

## Costs

- **Neon**: $0/month (free tier - 10GB storage)
- **Railway**: ~$5/month (usage-based)
- **Vercel**: $0/month (free tier - unlimited bandwidth)

**Total**: ~$5/month or free for light usage!

## Troubleshooting

### Backend won't start
- Check Railway logs
- Ensure DATABASE_URL is correct
- Run migrations: `npx prisma migrate deploy`

### Frontend can't reach backend
- Check NEXT_PUBLIC_API_URL in Vercel
- Check ALLOWED_ORIGINS in Railway
- Both should match exactly (no trailing slash)

### Database connection error
- Verify Neon connection string
- Check if database exists
- Try running migrations manually

## What's Next?

Once deployed:
- Share your URL with family!
- Start adding family members
- Future features coming soon:
  - Relationships
  - Family tree visualization
  - Photo uploads
  - Merge detection

---

**Need help?** Open an issue on GitHub or check the docs!

Built with ❤️ by Yael Dauber
