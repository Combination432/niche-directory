import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateSlug, isValidEmail, isValidUrl } from '@/lib/utils'
import { z } from 'zod'

const createListingSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  contactEmail: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  locationId: z.string().min(1, 'Location is required'),
  categoryIds: z.array(z.string()).min(1, 'At least one category is required'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = createListingSchema.parse(body)

    // Check if location exists
    const location = await prisma.location.findUnique({
      where: { id: validatedData.locationId },
    })

    if (!location) {
      return NextResponse.json(
        { error: 'Invalid location' },
        { status: 400 }
      )
    }

    // Check if categories exist
    const categories = await prisma.category.findMany({
      where: { id: { in: validatedData.categoryIds } },
    })

    if (categories.length !== validatedData.categoryIds.length) {
      return NextResponse.json(
        { error: 'Invalid categories' },
        { status: 400 }
      )
    }

    // Generate unique slug
    let slug = generateSlug(validatedData.name)
    let slugExists = await prisma.listing.findUnique({ where: { slug } })
    let counter = 1
    
    while (slugExists) {
      slug = `${generateSlug(validatedData.name)}-${counter}`
      slugExists = await prisma.listing.findUnique({ where: { slug } })
      counter++
    }

    // Create listing
    const listing = await prisma.listing.create({
      data: {
        name: validatedData.name,
        slug,
        description: validatedData.description,
        websiteUrl: validatedData.websiteUrl || null,
        contactEmail: validatedData.contactEmail,
        phone: validatedData.phone || null,
        locationId: validatedData.locationId,
        status: 'PENDING',
        isFeatured: false,
        categories: {
          create: validatedData.categoryIds.map((categoryId) => ({
            categoryId,
          })),
        },
      },
      include: {
        location: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      listing: {
        id: listing.id,
        name: listing.name,
        slug: listing.slug,
      },
    })
  } catch (error: any) {
    console.error('Error creating listing:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get('q')
    const categorySlug = searchParams.get('category')
    const locationSlug = searchParams.get('location')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const whereClause: any = {
      status: 'APPROVED',
    }

    if (q) {
      whereClause.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ]
    }

    if (categorySlug) {
      whereClause.categories = {
        some: {
          category: {
            slug: categorySlug,
          },
        },
      }
    }

    if (locationSlug) {
      whereClause.location = {
        slug: locationSlug,
      }
    }

    if (featured === 'true') {
      whereClause.isFeatured = true
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where: whereClause,
        include: {
          location: true,
          categories: {
            include: {
              category: true,
            },
          },
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        take: limit,
        skip: offset,
      }),
      prisma.listing.count({ where: whereClause }),
    ])

    return NextResponse.json({
      listings,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error('Error fetching listings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    )
  }
}
