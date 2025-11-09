import { Listing, Category, Location } from '@prisma/client'

type ListingWithRelations = Listing & {
  location: Location
  categories: Array<{ category: Category }>
}

export function generateListingStructuredData(listing: ListingWithRelations) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: listing.name,
    description: listing.description,
    url: listing.websiteUrl || `${baseUrl}/listing/${listing.slug}`,
    ...(listing.contactEmail && { email: listing.contactEmail }),
    ...(listing.phone && { telephone: listing.phone }),
    address: {
      '@type': 'PostalAddress',
      addressLocality: listing.location.city || listing.location.name,
      ...(listing.location.region && { addressRegion: listing.location.region }),
      ...(listing.location.country && { addressCountry: listing.location.country }),
    },
  }
}

export function generateItemListStructuredData(
  items: ListingWithRelations[],
  name: string,
  description: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    description,
    numberOfItems: items.length,
    itemListElement: items.map((listing, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'LocalBusiness',
        name: listing.name,
        url: `${baseUrl}/listing/${listing.slug}`,
        description: listing.description.substring(0, 200),
      },
    })),
  }
}

export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>
) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  }
}
