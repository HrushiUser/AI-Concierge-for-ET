# ET AI Concierge - Deployment Guide

Complete step-by-step guide to deploy your ET AI Concierge production-ready application.

## Pre-Deployment Checklist

- [ ] Supabase project created
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Build passes without errors (`npm run build`)
- [ ] All links tested and working
- [ ] Analytics dashboard tested locally

## Environment Variables Setup

### Step 1: Get Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select existing
3. Go to Settings > API
4. Copy your credentials:
   - Project URL (VITE_SUPABASE_URL)
   - Anon Public Key (VITE_SUPABASE_ANON_KEY)

### Step 2: Create .env File

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Database Setup

### Apply Migrations to Supabase

The migrations are already in your project at:
`supabase/migrations/20260327073350_create_et_concierge_schema.sql`

To apply:

1. **Via Supabase Dashboard:**
   - Go to SQL Editor
   - Copy the entire migration SQL
   - Paste and execute

2. **Via Supabase CLI (if installed):**
   ```bash
   supabase migration up
   ```

### Verify Database Tables

Log into Supabase and check:
- `user_profiles` table created
- `conversations` table created
- `recommendations` table created
- All RLS policies applied

## Local Testing

Before deployment, test locally:

```bash
# Install dependencies
npm install

# Type checking
npm run typecheck

# Build
npm run build

# Preview production build locally
npm run preview
```

Test the application:
1. Chat interface works smoothly
2. Recommendations appear after profiling
3. Links click through to actual ET services
4. Database saves user data
5. No console errors

## Deployment Options

### Option 1: Vercel (Recommended for Bolt Projects)

Best for quick deployment with zero configuration.

1. **Connect Repository:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub/GitLab/Bitbucket
   - Import your repository

2. **Configure Environment:**
   - Go to Settings > Environment Variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

3. **Deploy:**
   - Click Deploy
   - Your site goes live in ~2 minutes

4. **Custom Domain (Optional):**
   - Go to Domains in settings
   - Add your custom domain

### Option 2: Netlify

Easy deployment with excellent DX.

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

Or connect via dashboard:
1. Go to [netlify.com](https://netlify.com)
2. Create New Site > Import Existing Project
3. Select your repository
4. Add environment variables
5. Deploy

### Option 3: Railway.app

Great for full-stack applications.

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Import GitHub repository
4. Add environment variables
5. Deploy

### Option 4: Docker + Self-Hosted

For complete control.

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build
RUN npm run build

# Expose port
EXPOSE 3000

# Use vite preview for production
CMD ["npm", "run", "preview"]
```

Build and deploy:
```bash
docker build -t et-concierge .
docker run -p 3000:3000 \
  -e VITE_SUPABASE_URL=your_url \
  -e VITE_SUPABASE_ANON_KEY=your_key \
  et-concierge
```

## Security Considerations

### Database Security

1. **Row-Level Security (RLS)** - Already enabled
2. **Anonymous Access** - Configured for guest users
3. **Service Role Key** - Keep ONLY on backend
4. **Anon Key** - Safe to expose in frontend

### Frontend Security

1. **Environment Variables** - Never commit `.env`
2. **API Keys** - Use `VITE_` prefix (safe to expose)
3. **HTTPS** - Always use HTTPS in production
4. **CORS** - Supabase handles cross-origin requests

### Recommended Production Settings

```sql
-- In Supabase SQL Editor

-- Enable RLS on all tables (already done)
-- Verify policies are restrictive
-- Remove any public access that's not needed

-- Check existing policies:
SELECT * FROM pg_policies;

-- Verify user authentication works:
SELECT auth.uid();
```

## Post-Deployment

### Monitoring

1. **Vercel Analytics:**
   - Monitor performance metrics
   - Check error logs
   - Track user sessions

2. **Supabase Monitoring:**
   - Check API rate limits
   - Monitor database storage
   - Review auth events

### Updates & Maintenance

1. **Pull latest code:**
   ```bash
   git pull origin main
   ```

2. **Deploy:**
   - Vercel: Automatic on git push
   - Netlify: Automatic on git push
   - Docker: Rebuild and redeploy

3. **Database migrations:**
   - Apply new migrations via Supabase dashboard
   - Verify data integrity

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules
npm install
npm run build
```

### Database Connection Issues
- Verify Supabase credentials in .env
- Check database is running
- Verify RLS policies aren't blocking access

### Blank Page in Production
- Check browser console for errors
- Verify environment variables are set
- Check network tab for 404s

### Recommendations Not Showing
- Verify database tables exist
- Check RLS policies
- Review console for SQL errors

## Performance Optimization

### Frontend
- Vite handles minification automatically
- Tree-shaking removes unused code
- Code splitting via dynamic imports

### Database
- Indexes on frequently queried columns
- Query results are cached
- Connection pooling via Supabase

### CDN
- Static files cached globally
- Images optimized and compressed
- Fast delivery worldwide

## Scaling

As you grow:

1. **Supabase Upgrades:**
   - Increase database size
   - Enable read replicas
   - Add backup frequency

2. **Frontend Optimization:**
   - Add image optimization
   - Implement service workers
   - Cache recommendations

3. **Analytics:**
   - Set up proper monitoring
   - Create dashboards
   - Set up alerts

## Cost Estimation

### Supabase (Free Tier)
- 500MB database storage
- Unlimited API requests
- 5MB file storage
- All features included

### Vercel (Free Tier)
- Unlimited deployments
- 12 serverless function executions/month
- 1GB bandwidth/month
- Hobby tier included

### Total Cost for MVP
**$0** on free tiers
Scales as you grow

## Support Resources

- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)
- [Tailwind Docs](https://tailwindcss.com/docs)

## Next Steps After Deployment

1. **Share with stakeholders** - Get feedback
2. **Monitor analytics** - Track user behavior
3. **Iterate** - Add new features based on usage
4. **Scale** - Upgrade infrastructure as needed
5. **Expand** - Add more ET services and features

---

Your application is now production-ready and deployed! 🎉
