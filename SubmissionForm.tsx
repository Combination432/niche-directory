'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Category, Location } from '@prisma/client'

type Props = {
  categories: Category[]
  locations: Location[]
}

export function SubmissionForm({ categories, locations }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [honeypot, setHoneypot] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    websiteUrl: '',
    contactEmail: '',
    phone: '',
    locationId: '',
    categoryIds: [] as string[],
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Honeypot check
    if (honeypot) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit listing')
      }

      setSuccess(true)
      setFormData({
        name: '',
        websiteUrl: '',
        contactEmail: '',
        phone: '',
        locationId: '',
        categoryIds: [],
        description: '',
      })

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryToggle = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId]
    }))
  }

  if (success) {
    return (
      <div className="card bg-green-50 border-green-200">
        <div className="text-center py-8">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Submission Received!
          </h2>
          <p className="text-gray-700 mb-6">
            Thank you for submitting your listing. We'll review it and get back to you soon.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="btn btn-primary"
          >
            Submit Another Listing
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Honeypot field */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Business Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input"
          placeholder="Enter business name"
        />
      </div>

      <div>
        <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-1">
          Website URL
        </label>
        <input
          type="url"
          id="websiteUrl"
          value={formData.websiteUrl}
          onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
          className="input"
          placeholder="https://example.com"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="contactEmail"
            required
            value={formData.contactEmail}
            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
            className="input"
            placeholder="contact@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="input"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <div>
        <label htmlFor="locationId" className="block text-sm font-medium text-gray-700 mb-1">
          Location <span className="text-red-500">*</span>
        </label>
        <select
          id="locationId"
          required
          value={formData.locationId}
          onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
          className="input"
        >
          <option value="">Select a location</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categories <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-600 mb-3">Select all that apply</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((category) => (
            <label
              key={category.id}
              className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                formData.categoryIds.includes(category.id)
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.categoryIds.includes(category.id)}
                onChange={() => handleCategoryToggle(category.id)}
                className="mr-2"
              />
              <span className="text-sm">{category.name}</span>
            </label>
          ))}
        </div>
        {formData.categoryIds.length === 0 && (
          <p className="text-sm text-red-500 mt-1">Please select at least one category</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="input min-h-[150px]"
          placeholder="Describe your business, services, and what makes you unique..."
        />
        <p className="text-sm text-gray-500 mt-1">
          {formData.description.length} characters
        </p>
      </div>

      <button
        type="submit"
        disabled={loading || formData.categoryIds.length === 0}
        className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting...' : 'Submit Listing'}
      </button>

      <p className="text-sm text-gray-600 text-center">
        By submitting, you agree to our terms and conditions. All submissions are reviewed before publication.
      </p>
    </form>
  )
}
