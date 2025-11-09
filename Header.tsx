import Link from 'next/link'

export function Header() {
  const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Niche Directory'

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600">
              {SITE_NAME}
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/categories"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/locations"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Locations
            </Link>
            <Link
              href="/submit"
              className="btn btn-primary"
            >
              Submit Listing
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Link href="/submit" className="btn btn-primary text-sm">
              Submit
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
