import { Metadata } from 'next'

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Niche Directory'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export function generateMetadata({
  title,
  description,
  path = '',
  noIndex = false,
}: {
  title: string
  description: string
  path?: string
  noIndex?: boolean
}): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`
  const url = `${SITE_URL}${path}`

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
    alternates: {
      canonical: url,
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}

export function generateListingMetadata({
  name,
  description,
  category,
  location,
  slug,
}: {
  name: string
  description: string
  category?: string
  location: string
  slug: string
}) {
  const categoryText = category ? `${category} in` : ''
  const title = `${name} – ${categoryText} ${location}`.replace(/\s+/g, ' ')
  
  return generateMetadata({
    title,
    description,
    path: `/listing/${slug}`,
  })
}

export function generateCategoryMetadata({
  categoryName,
  slug,
  count,
}: {
  categoryName: string
  slug: string
  count: number
}) {
  return generateMetadata({
    title: categoryName,
    description: `Browse ${count} ${categoryName.toLowerCase()} listings. Find the best options in your area.`,
    path: `/category/${slug}`,
  })
}

export function generateLocationMetadata({
  locationName,
  slug,
  count,
}: {
  locationName: string
  slug: string
  count: number
}) {
  return generateMetadata({
    title: `Listings in ${locationName}`,
    description: `Discover ${count} quality listings in ${locationName}. Browse local businesses and services.`,
    path: `/location/${slug}`,
  })
}

export function generateCategoryLocationMetadata({
  categoryName,
  locationName,
  categorySlug,
  locationSlug,
  count,
}: {
  categoryName: string
  locationName: string
  categorySlug: string
  locationSlug: string
  count: number
}) {
  return generateMetadata({
    title: `${categoryName} in ${locationName}`,
    description: `Find the best ${categoryName.toLowerCase()} in ${locationName}. Browse ${count} verified listings.`,
    path: `/${categorySlug}/${locationSlug}`,
  })
}
