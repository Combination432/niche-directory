import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all approved listings
  const listings = await prisma.listing.findMany({
    where: { status: 'APPROVED' },
    select: { slug: true, updatedAt: true },
  })

  // Get all categories
  const categories = await prisma.category.findMany({
    select: { slug: true },
  })

  // Get all locations
  const locations = await prisma.location.findMany({
    select: { slug: true },
  })

  // Generate category + location combinations
  const categoryLocationCombos: Array<{ categorySlug: string; locationSlug: string }> = []
  
  for (const category of categories) {
    for (const location of locations) {
      const hasListings = await prisma.listing.findFirst({
        where: {
          status: 'APPROVED',
          locationId: location.slug,
          categories: {
            some: {
              category: {
                slug: category.slug,
              },
            },
          },
        },
      })
      
      if (hasListings) {
        categoryLocationCombos.push({
          categorySlug: category.slug,
          locationSlug: location.slug,
        })
      }
    }
  }

  const sitemap: MetadataRoute.Sitemap = [
    // Homepage
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // Categories index
    {
      url: `${BASE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Locations index
    {
      url: `${BASE_URL}/locations`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Submit page
    {
      url: `${BASE_URL}/submit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Category pages
    ...categories.map((category) => ({
      url: `${BASE_URL}/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    // Location pages
    ...locations.map((location) => ({
      url: `${BASE_URL}/location/${location.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    // Category + Location pages
    ...categoryLocationCombos.map((combo) => ({
      url: `${BASE_URL}/${combo.categorySlug}/${combo.locationSlug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    // Listing pages
    ...listings.map((listing) => ({
      url: `${BASE_URL}/listing/${listing.slug}`,
      lastModified: listing.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]

  return sitemap
}
