'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Listing, Location, Category } from '@prisma/client'
import { truncate } from '@/lib/utils'

type ListingWithRelations = Listing & {
  location: Location
  categories: Array<{ category: Category }>
}

type Props = {
  listings: ListingWithRelations[]
}

export function AdminListingTable({ listings: initialListings }: Props) {
  const router = useRouter()
  const [listings, setListings] = useState(initialListings)
  const [loading, setLoading] = useState<string | null>(null)

  const handleAction = async (
    listingId: string,
    action: 'approve' | 'reject' | 'feature' | 'unfeature'
  ) => {
    setLoading(listingId)
    
    try {
      const response = await fetch(`/api/admin/listings/${listingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })

      if (!response.ok) {
        throw new Error('Action failed')
      }

      router.refresh()
    } catch (error) {
      alert('Action failed. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  if (listings.length === 0) {
    return (
      <p className="text-gray-600 text-center py-8">
        No listings found
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Location
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Category
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {listings.map((listing) => (
            <tr key={listing.id} className="hover:bg-gray-50">
              <td className="px-4 py-4">
                <div>
                  <p className="font-medium text-gray-900">{listing.name}</p>
                  <p className="text-sm text-gray-500">
                    {truncate(listing.description, 80)}
                  </p>
                  {listing.isFeatured && (
                    <span className="badge badge-featured text-xs mt-1">
                      Featured
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-4 text-sm text-gray-700">
                {listing.location.name}
              </td>
              <td className="px-4 py-4 text-sm text-gray-700">
                {listing.categories.map((c) => c.category.name).join(', ')}
              </td>
              <td className="px-4 py-4">
                <span
                  className={`badge ${
                    listing.status === 'APPROVED'
                      ? 'badge-approved'
                      : listing.status === 'PENDING'
                      ? 'badge-pending'
                      : 'badge-rejected'
                  }`}
                >
                  {listing.status}
                </span>
              </td>
              <td className="px-4 py-4">
                <div className="flex gap-2">
                  {listing.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleAction(listing.id, 'approve')}
                        disabled={loading === listing.id}
                        className="text-xs px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(listing.id, 'reject')}
                        disabled={loading === listing.id}
                        className="text-xs px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {listing.status === 'APPROVED' && (
                    <button
                      onClick={() =>
                        handleAction(
                          listing.id,
                          listing.isFeatured ? 'unfeature' : 'feature'
                        )
                      }
                      disabled={loading === listing.id}
                      className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded disabled:opacity-50"
                    >
                      {listing.isFeatured ? 'Unfeature' : 'Feature'}
                    </button>
                  )}
                  <a
                    href={`/listing/${listing.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1 bg-primary-100 text-primary-700 hover:bg-primary-200 rounded"
                  >
                    View
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
