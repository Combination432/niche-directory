# Niche Directory - Production-Ready Directory Application

A complete, production-ready directory website built with Next.js 14, TypeScript, Prisma, and Tailwind CSS. Designed to run seamlessly on Replit and easily customizable for any niche market.

## 🚀 Features

- **Modern Tech Stack**: Next.js 14 (App Router), TypeScript, Prisma ORM, Tailwind CSS
- **Programmatic SEO**: Dynamic sitemap, robots.txt, structured data (JSON-LD)
- **Multi-dimensional Navigation**: Browse by category, location, or category+location
- **Full-text Search**: Search across listings by name and description
- **Admin Dashboard**: Approve/reject listings, feature listings, manage content
- **Secure Authentication**: JWT-based admin auth with bcrypt password hashing
- **Submission System**: Public submission form with honeypot spam protection
- **Responsive Design**: Mobile-first, clean Tailwind UI
- **Database Seeding**: 50+ sample listings across 10 categories and 10 locations
- **Internal Linking**: SEO-optimized cross-linking between categories, locations, and listings

## 📁 Project Structure

```
niche-directory/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seed script
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── api/               # API routes
│   │   ├── category/          # Category pages
│   │   ├── location/          # Location pages
│   │   ├── listing/           # Individual listing pages
│   │   ├── [categorySlug]/    # Category+Location combo pages
│   │   ├── search/            # Search results page
│   │   ├── submit/            # Listing submission page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   ├── globals.css        # Global styles
│   │   ├── sitemap.ts         # Dynamic sitemap
│   │   └── robots.ts          # Robots.txt
│   ├── components/            # Reusable React components
│   │   ├── admin/             # Admin-specific components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── SearchBar.tsx
│   │   ├── ListingCard.tsx
│   │   └── SubmissionForm.tsx
│   └── lib/                   # Utility functions
│       ├── auth.ts            # Authentication utilities
│       ├── metadata.ts        # SEO metadata generators
│       ├── prisma.ts          # Prisma client singleton
│       ├── structured-data.ts # JSON-LD generators
│       └── utils.ts           # Helper functions
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── .env.example
```

## 🛠️ Local Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation Steps

1. **Clone or download the repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and update:
   ```env
   DATABASE_URL="file:./dev.db"
   ADMIN_EMAIL="admin@example.com"
   ADMIN_PASSWORD="your-secure-password"
   JWT_SECRET="your-random-secret-key-min-32-chars"
   NEXT_PUBLIC_SITE_NAME="Your Directory Name"
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🚀 Replit Setup

This application is optimized for Replit deployment.

### Quick Start on Replit

1. **Create a new Repl**
   - Click "Create Repl"
   - Choose "Import from GitHub" or upload the files
   - Select Node.js as the template

2. **Configure Environment Variables**
   In the Replit "Secrets" tab (🔒 icon), add:
   ```
   DATABASE_URL=file:./prisma/dev.db
   ADMIN_EMAIL=admin@yourdomain.com
   ADMIN_PASSWORD=ChangeThisPassword123!
   JWT_SECRET=your-super-secret-jwt-key-should-be-very-long-and-random
   NEXT_PUBLIC_SITE_NAME=Your Directory Name
   NEXT_PUBLIC_SITE_URL=https://your-repl-name.your-username.repl.co
   ```

3. **Install and Setup**
   Run these commands in the Replit shell:
   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

4. **Start the Application**
   ```bash
   npm run dev
   ```
   
   Replit will automatically detect the port and provide a URL.

### Replit-Specific Notes

- **Port**: Next.js runs on port 3000 by default (handled automatically by Replit)
- **Database**: SQLite is used by default (stored in `prisma/dev.db`)
- **Persistence**: The database file persists across Replit sessions
- **Environment**: All secrets are securely stored in Replit's Secrets manager

## 📊 Database Schema

### Models

- **Listing**: Main listing entity with status, featured flag
- **Category**: Organizing taxonomy for listings
- **Location**: Geographic organization
- **ListingCategory**: Many-to-many relationship (listings ↔ categories)
- **Tag**: Optional tags for listings
- **ListingTag**: Many-to-many relationship (listings ↔ tags)
- **AdminUser**: Admin authentication

### Status Values

- `PENDING`: Awaiting approval
- `APPROVED`: Live on the site
- `REJECTED`: Rejected by admin

## 🔐 Admin Access

### Default Credentials (from seed)

- **Email**: `admin@example.com`
- **Password**: `changeme123`

**⚠️ IMPORTANT**: Change these credentials in production!

### Admin Features

- View all listings by status
- Approve/reject pending submissions
- Toggle featured status
- View listing details
- Quick stats dashboard

### Admin Routes

- `/admin/login` - Login page
- `/admin` - Main dashboard
- Protected by server-side authentication

## 🎨 Customization

### Change Site Name and Branding

1. Update `.env`:
   ```env
   NEXT_PUBLIC_SITE_NAME="Your Business Name"
   ```

2. Customize colors in `tailwind.config.js`:
   ```javascript
   colors: {
     primary: {
       // Change these hex values
       500: '#0ea5e9',
       600: '#0284c7',
       // ...
     }
   }
   ```

3. Update logo/branding in `src/components/Header.tsx`

### Add Custom Categories/Locations

Edit `prisma/seed.ts` before running `npm run db:seed`, or add via Prisma Studio:
```bash
npm run db:studio
```

### Modify Listing Fields

1. Update `prisma/schema.prisma`
2. Run migration:
   ```bash
   npx prisma db push
   ```
3. Update forms and display components

## 🔍 SEO Implementation

### Dynamic Metadata

Every page generates appropriate meta tags:
- Title templates
- Descriptions
- Open Graph tags
- Twitter cards
- Canonical URLs

### Sitemap

Auto-generated at `/sitemap.xml` including:
- Homepage
- All categories
- All locations
- Category+location combinations
- All approved listings

### Structured Data

JSON-LD markup on:
- Listing pages: `LocalBusiness` schema
- Category/location pages: `ItemList` schema

### Internal Linking

- Listing pages link to their category and location
- Category pages link to related locations
- Location pages link to categories present in that location
- Breadcrumb navigation throughout

## 📝 API Routes

### Public API

- `GET /api/listings` - Search/filter listings
  - Query params: `q`, `category`, `location`, `featured`, `limit`, `offset`
- `POST /api/listings` - Submit new listing (public)

### Admin API (Protected)

- `PATCH /api/admin/listings/[id]` - Update listing (approve/reject/feature)
- `DELETE /api/admin/listings/[id]` - Delete listing
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout

## 🚀 Deployment

### Production Checklist

- [ ] Update `NEXT_PUBLIC_SITE_URL` to production domain
- [ ] Change admin credentials
- [ ] Generate new `JWT_SECRET` (min 32 characters)
- [ ] Review and update site name
- [ ] Test all pages and forms
- [ ] Verify sitemap is accessible
- [ ] Check robots.txt
- [ ] Test mobile responsiveness
- [ ] Configure database backups (if not using Replit)

### Production Build

```bash
npm run build
npm start
```

### Database Migration to PostgreSQL

To switch from SQLite to PostgreSQL:

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Update `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   ```

3. Run migration:
   ```bash
   npx prisma migrate dev --name init
   npm run db:seed
   ```

## 🛠️ Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run db:push      # Push schema changes to database
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio (database GUI)
```

## 📦 Tech Stack Details

- **Framework**: Next.js 14.0.4 (App Router)
- **Language**: TypeScript 5.3
- **Database**: SQLite (via Prisma) - easily swappable to PostgreSQL
- **ORM**: Prisma 5.7
- **Styling**: Tailwind CSS 3.4
- **Authentication**: JWT (jose) + bcrypt
- **Validation**: Zod
- **Runtime**: Node.js 18+

## 🔒 Security Features

- JWT-based session management
- Bcrypt password hashing
- Server-side route protection
- CSRF protection via same-site cookies
- Input validation with Zod
- SQL injection protection via Prisma
- XSS prevention via React
- Honeypot spam protection on forms

## 📈 Performance

- Static page generation where possible
- Revalidation every hour for dynamic pages
- Optimized database queries with indexes
- Lazy loading of components
- Image optimization (ready for next/image)

## 🐛 Troubleshooting

### Database Issues

**Problem**: `prisma generate` fails
```bash
# Solution: Delete node_modules and reinstall
rm -rf node_modules
npm install
npx prisma generate
```

**Problem**: Database locked
```bash
# Solution: Delete the database and recreate
rm prisma/dev.db
npx prisma db push
npm run db:seed
```

### Build Errors

**Problem**: TypeScript errors
```bash
# Build ignores TypeScript errors, but to fix:
npm run build
# Check specific errors and fix in source files
```

### Replit-Specific

**Problem**: Port already in use
- Stop the current process and restart
- Replit automatically handles port assignment

**Problem**: Environment variables not loading
- Ensure secrets are set in Replit Secrets tab (not .env file)
- Restart the Repl after adding secrets

## 📄 License

This is a starter template - use it however you like!

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the code comments
3. Inspect Prisma Studio for database issues: `npm run db:studio`

## 🎯 Next Steps

1. **Customize branding**: Update site name, colors, logo
2. **Add your niche data**: Update categories and locations in seed script
3. **Configure domain**: Update NEXT_PUBLIC_SITE_URL
4. **Add content**: Create your own listing descriptions
5. **Monetization**: Add Stripe integration for featured listings
6. **Analytics**: Integrate Google Analytics or Plausible
7. **Email**: Add email notifications for approved listings (SendGrid/Mailgun)

---

Built with ❤️ for niche directory operators. Ready to scale!
