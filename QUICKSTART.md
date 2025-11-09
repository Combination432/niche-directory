# 🚀 QUICKSTART GUIDE

Get your niche directory running in under 5 minutes!

## Option 1: Local Development (Fastest)

```bash
# 1. Navigate to the project
cd niche-directory

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Setup database
npx prisma generate
npx prisma db push
npm run db:seed

# 5. Start the server
npm run dev
```

**Open http://localhost:3000** 🎉

### Default Admin Login
- Email: `admin@example.com`
- Password: `changeme123`
- Admin URL: http://localhost:3000/admin/login

---

## Option 2: Replit (Zero Setup)

1. **Upload to Replit** or import from GitHub

2. **Add Secrets** (Click 🔒 Secrets tab):
   ```
   DATABASE_URL=file:./prisma/dev.db
   ADMIN_EMAIL=admin@yourdomain.com
   ADMIN_PASSWORD=YourSecurePassword123!
   JWT_SECRET=long-random-secret-key-at-least-32-characters
   NEXT_PUBLIC_SITE_NAME=Your Directory Name
   NEXT_PUBLIC_SITE_URL=https://your-repl.repl.co
   ```

3. **Run Setup** (in Shell):
   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

4. **Click Run** button

That's it! Your directory is live! 🚀

---

## What You Get Out of the Box

✅ **50+ Sample Listings** across 10 categories and 10 locations
✅ **Full Admin Dashboard** at `/admin`
✅ **Public Submission Form** at `/submit`
✅ **SEO-Optimized** with sitemap and structured data
✅ **Search Functionality** 
✅ **Responsive Design**
✅ **Production-Ready**

---

## First Steps After Setup

### 1. Change Admin Password
```bash
# Option A: Update .env (or Replit Secrets)
ADMIN_PASSWORD=YourNewSecurePassword

# Option B: Use Prisma Studio
npm run db:studio
# Navigate to AdminUser table and update
```

### 2. Customize Site Name
Update in `.env` (or Replit Secrets):
```
NEXT_PUBLIC_SITE_NAME=Your Business Name
```

### 3. Clear Sample Data (Optional)
```bash
# Delete database and start fresh
rm prisma/dev.db
npx prisma db push

# Or keep samples and add your own
npm run db:studio
```

### 4. Add Your Categories
Edit `prisma/seed.ts` and update the categories array, then:
```bash
npm run db:seed
```

### 5. Import Your Listings
Use the CSV import tool:
```bash
# 1. Prepare your CSV (see sample-import.csv)
# 2. Run import
tsx scripts/importListings.ts your-listings.csv
```

---

## Key URLs

| Page | URL | Purpose |
|------|-----|---------|
| Homepage | `/` | Main landing page |
| Categories | `/categories` | Browse all categories |
| Locations | `/locations` | Browse all locations |
| Search | `/search?q=keyword` | Search listings |
| Submit | `/submit` | Public submission form |
| Admin Login | `/admin/login` | Admin authentication |
| Admin Dashboard | `/admin` | Manage listings |
| Sitemap | `/sitemap.xml` | SEO sitemap |

---

## Common Tasks

### Approve a Listing
1. Go to `/admin`
2. Find pending listing
3. Click "Approve"

### Feature a Listing
1. Go to `/admin`
2. Find approved listing
3. Click "Feature"

### Add a Category
```bash
npm run db:studio
# Add in Category table
```

### Add a Location
```bash
npm run db:studio
# Add in Location table
```

---

## Troubleshooting

**Port already in use:**
```bash
# Kill process and restart
pkill -f "next dev"
npm run dev
```

**Database locked:**
```bash
rm prisma/dev.db
npx prisma db push
npm run db:seed
```

**Build fails:**
```bash
rm -rf .next node_modules
npm install
npm run build
```

---

## Production Deployment

### Update for Production:
1. Change `NEXT_PUBLIC_SITE_URL` to your domain
2. Update `ADMIN_PASSWORD` to strong password
3. Generate new `JWT_SECRET` (32+ characters)
4. Run production build:
   ```bash
   npm run build
   npm start
   ```

### Switch to PostgreSQL:
See README.md section "Database Migration to PostgreSQL"

---

## Need Help?

- 📖 Full documentation: See README.md
- 🐛 Check troubleshooting section
- 💾 Inspect database: `npm run db:studio`
- 🔍 Review code comments in source files

---

## Project Structure

```
niche-directory/
├── src/
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   └── lib/             # Utilities & helpers
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Sample data
├── scripts/
│   └── importListings.ts # CSV import tool
└── package.json
```

---

**You're all set! Start customizing and launch your directory! 🎉**

For detailed documentation, see [README.md](./README.md)
