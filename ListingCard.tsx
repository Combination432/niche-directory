import Link from 'next/link'
import { Listing, Location, Category } from '@prisma/client'
import { truncate } from '@/lib/utils'

type ListingCardProps = {
  listing: Listing & {
    location: Location
    categories: Array<{ category: Category }>
  }
}

export function ListingCard({ listing }: ListingCardProps) {
  const primaryCategory = listing.categories[0]?.category

  return (
    <Link
      href={`/listing/${listing.slug}`}
      className="card hover:shadow-xl transition-all duration-200 flex flex-col h-full"
    >
      {listing.isFeatured && (
        <div className="mb-3">
          <span className="badge badge-featured">Featured</span>
        </div>
      )}
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">{listing.name}</h3>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {primaryCategory && (
          <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded">
            {primaryCategory.name}
          </span>
        )}
        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
          {listing.location.name}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 flex-grow">
        {truncate(listing.description, 150)}
      </p>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-primary-600 font-medium text-sm">View Details →</span>
      </div>
    </Link>
  )
}
