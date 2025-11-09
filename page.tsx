import { SubmissionForm } from '@/components/SubmissionForm'
import { generateMetadata } from '@/lib/metadata'
import { prisma } from '@/lib/prisma'

export const metadata = generateMetadata({
  title: 'Submit a Listing',
  description: 'Submit your business to our directory. Free listings available with optional featured placement.',
})

export default async function SubmitPage() {
  const [categories, locations] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: 'asc' },
    }),
    prisma.location.findMany({
      orderBy: { name: 'asc' },
    }),
  ])

  return (
    <div>
      <div className="bg-gradient-to-b from-primary-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Submit Your Listing
            </h1>
            <p className="text-xl text-gray-600">
              Get your business in front of thousands of potential customers.
              Fill out the form below to submit your listing for review.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <SubmissionForm categories={categories} locations={locations} />
          
          <div className="mt-8 card bg-primary-50 border-primary-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              What happens next?
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Your listing will be reviewed by our team</li>
              <li>You'll receive an email once it's approved</li>
              <li>Your listing will appear in our directory</li>
              <li>Optional: Upgrade to featured placement for more visibility</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
