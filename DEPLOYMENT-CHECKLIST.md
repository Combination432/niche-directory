# 🚀 Deployment Checklist

Use this checklist when deploying to production.

## Pre-Deployment

### 1. Environment Variables
- [ ] Set `NEXT_PUBLIC_SITE_NAME` to your brand name
- [ ] Set `NEXT_PUBLIC_SITE_URL` to your production domain
- [ ] Generate new `JWT_SECRET` (min 32 random characters)
- [ ] Create strong `ADMIN_PASSWORD` (min 12 chars, mixed case, numbers, symbols)
- [ ] Update `ADMIN_EMAIL` to your email
- [ ] Set `DATABASE_URL` (SQLite for MVP, PostgreSQL for scale)

### 2. Security
- [ ] Change default admin credentials immediately after first login
- [ ] Ensure `.env` is in `.gitignore` (already configured)
- [ ] Never commit secrets to git
- [ ] Use environment variables/secrets manager on hosting platform
- [ ] Review CORS settings if adding external APIs

### 3. Customization
- [ ] Update site branding in `src/components/Header.tsx`
- [ ] Customize primary colors in `tailwind.config.js`
- [ ] Update footer links in `src/components/Footer.tsx`
- [ ] Add your logo/favicon
- [ ] Review and update meta descriptions

### 4. Content
- [ ] Clear sample data or keep for testing:
  ```bash
  # Option 1: Keep samples
  npm run db:seed
  
  # Option 2: Start fresh
  rm prisma/dev.db
  npx prisma db push
  ```
- [ ] Add your categories in seed script or via Prisma Studio
- [ ] Add your locations in seed script or via Prisma Studio
- [ ] Import your listings via CSV or manual entry

### 5. SEO Setup
- [ ] Update homepage title and description
- [ ] Verify `NEXT_PUBLIC_SITE_URL` is correct
- [ ] Test `/sitemap.xml` loads correctly
- [ ] Test `/robots.txt` loads correctly
- [ ] Add site to Google Search Console
- [ ] Submit sitemap to Google Search Console
- [ ] Add site to Bing Webmaster Tools (optional)

## Replit Deployment

### Setup (One-Time)
- [ ] Create Replit account
- [ ] Create new Repl (Import from GitHub or upload files)
- [ ] Select Node.js template

### Configure Secrets (Replit Secrets Tab)
Add these secrets:
- [ ] `DATABASE_URL=file:./prisma/dev.db`
- [ ] `ADMIN_EMAIL=your-email@domain.com`
- [ ] `ADMIN_PASSWORD=YourStrongPassword123!`
- [ ] `JWT_SECRET=your-random-32-char-secret`
- [ ] `NEXT_PUBLIC_SITE_NAME=Your Directory Name`
- [ ] `NEXT_PUBLIC_SITE_URL=https://your-repl.repl.co`

### Run Commands (In Replit Shell)
```bash
# 1. Install dependencies
npm install

# 2. Setup database
npx prisma generate
npx prisma db push

# 3. Seed data (optional)
npm run db:seed

# 4. Start application
npm run dev
```

### Post-Deployment (Replit)
- [ ] Click the "Open in new tab" button to view site
- [ ] Test public pages load correctly
- [ ] Test search functionality
- [ ] Test submission form
- [ ] Login to admin panel
- [ ] Change admin password immediately
- [ ] Test approve/reject workflow
- [ ] Test featured toggle

## Vercel Deployment (Alternative)

### Setup
- [ ] Push code to GitHub
- [ ] Connect Vercel to GitHub repo
- [ ] Import project in Vercel dashboard

### Environment Variables (Vercel)
Add in Project Settings → Environment Variables:
- [ ] `DATABASE_URL` (use Vercel Postgres or external)
- [ ] `ADMIN_EMAIL`
- [ ] `ADMIN_PASSWORD`
- [ ] `JWT_SECRET`
- [ ] `NEXT_PUBLIC_SITE_NAME`
- [ ] `NEXT_PUBLIC_SITE_URL`

### Database (Vercel)
Choose one:
- [ ] **Option A**: Use SQLite (limited, not recommended for production)
- [ ] **Option B**: Use Vercel Postgres (recommended)
  - Create Postgres database in Vercel
  - Update `prisma/schema.prisma` provider to `postgresql`
  - Run migrations: `npx prisma migrate dev --name init`

### Deploy
- [ ] Click "Deploy" in Vercel
- [ ] Wait for build to complete
- [ ] Visit deployment URL
- [ ] Test all functionality

## Post-Deployment Testing

### Public Site Testing
- [ ] Homepage loads correctly
- [ ] Search works
- [ ] Category pages load
- [ ] Location pages load
- [ ] Category+Location combo pages load
- [ ] Individual listing pages load
- [ ] Submit form works
- [ ] Links work (header, footer, internal)
- [ ] Mobile responsive (test on phone)

### Admin Testing
- [ ] `/admin/login` loads
- [ ] Can login with credentials
- [ ] Dashboard shows stats
- [ ] Can view all listings
- [ ] Can approve pending listings
- [ ] Can reject pending listings
- [ ] Can toggle featured status
- [ ] Can view individual listings
- [ ] Logout works

### SEO Testing
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`
- [ ] View source shows meta tags
- [ ] Structured data validates (use Google's Rich Results Test)
- [ ] Open Graph tags present (test with Facebook Debugger)

### Performance Testing
- [ ] Pages load in < 3 seconds
- [ ] No console errors in browser
- [ ] No 404 errors
- [ ] Images load correctly
- [ ] Forms submit without errors

## Optional Enhancements

### Analytics
- [ ] Add Google Analytics or Plausible
- [ ] Track key events (searches, submissions, conversions)

### Monitoring
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Set up error tracking (Sentry)
- [ ] Set up performance monitoring

### Email Notifications
- [ ] Integrate SendGrid or Mailgun
- [ ] Send confirmation emails on listing submission
- [ ] Send approval notifications
- [ ] Send featured listing purchase confirmations

### Payments (For Featured Listings)
- [ ] Integrate Stripe
- [ ] Create pricing page
- [ ] Add payment flow for featured listings
- [ ] Test payment flow thoroughly

### Backups
- [ ] Set up database backups (daily recommended)
- [ ] Test restore process
- [ ] Store backups securely

### Domain & SSL
- [ ] Purchase custom domain
- [ ] Point domain to hosting provider
- [ ] Ensure SSL certificate is active
- [ ] Update `NEXT_PUBLIC_SITE_URL` to custom domain

## Maintenance Schedule

### Daily
- [ ] Check pending submissions (or enable email alerts)
- [ ] Monitor for spam submissions
- [ ] Review site uptime

### Weekly
- [ ] Review analytics
- [ ] Check for broken links
- [ ] Review and respond to any issues

### Monthly
- [ ] Update dependencies: `npm update`
- [ ] Review database size/performance
- [ ] Backup database
- [ ] Review SEO performance (Search Console)

### Quarterly
- [ ] Update Node.js version if needed
- [ ] Major dependency updates
- [ ] Security audit
- [ ] Performance optimization review

## Security Hardening (Production)

### Immediate
- [ ] Change all default passwords
- [ ] Use strong JWT secret (32+ random chars)
- [ ] Enable HTTPS only
- [ ] Set secure cookie flags (already configured)

### Recommended
- [ ] Add rate limiting to API routes
- [ ] Implement CAPTCHA on submission form (optional)
- [ ] Set up Web Application Firewall (WAF)
- [ ] Regular security updates

## Rollback Plan

If something goes wrong:

### Replit
1. Stop the Repl
2. Restore previous code from GitHub
3. Check environment variables
4. Restart the Repl

### Vercel
1. Go to Deployments tab
2. Click on previous working deployment
3. Click "Promote to Production"

### Database
1. Stop application
2. Restore database from backup
3. Restart application

## Success Metrics to Track

- [ ] Number of listings (growth over time)
- [ ] Number of submissions per week
- [ ] Search queries (popular terms)
- [ ] Most viewed categories
- [ ] Most viewed locations
- [ ] Conversion rate (submissions → approvals)
- [ ] Featured listing uptake
- [ ] Site traffic (unique visitors, pageviews)
- [ ] Bounce rate
- [ ] Average session duration

## Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://prisma.io/docs  
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Replit Docs**: https://docs.replit.com
- **Vercel Docs**: https://vercel.com/docs

---

**Once complete, your directory is production-ready! 🎉**

Keep this checklist for future deployments and updates.
