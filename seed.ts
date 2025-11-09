import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'
import { generateSlug } from '../src/lib/utils'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  console.log('Creating admin user...')
  await prisma.adminUser.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: await hashPassword('changeme123'),
    },
  })

  // Create categories
  console.log('Creating categories...')
  const categories = [
    'Restaurants',
    'Coffee Shops',
    'Retail Stores',
    'Services',
    'Health & Wellness',
    'Entertainment',
    'Education',
    'Professional Services',
    'Home Services',
    'Automotive',
  ]

  const createdCategories = await Promise.all(
    categories.map((name) =>
      prisma.category.upsert({
        where: { slug: generateSlug(name) },
        update: {},
        create: {
          name,
          slug: generateSlug(name),
        },
      })
    )
  )

  // Create locations
  console.log('Creating locations...')
  const locations = [
    { name: 'New York, NY', city: 'New York', region: 'NY', country: 'USA' },
    { name: 'Los Angeles, CA', city: 'Los Angeles', region: 'CA', country: 'USA' },
    { name: 'Chicago, IL', city: 'Chicago', region: 'IL', country: 'USA' },
    { name: 'Houston, TX', city: 'Houston', region: 'TX', country: 'USA' },
    { name: 'Phoenix, AZ', city: 'Phoenix', region: 'AZ', country: 'USA' },
    { name: 'Philadelphia, PA', city: 'Philadelphia', region: 'PA', country: 'USA' },
    { name: 'San Antonio, TX', city: 'San Antonio', region: 'TX', country: 'USA' },
    { name: 'San Diego, CA', city: 'San Diego', region: 'CA', country: 'USA' },
    { name: 'Dallas, TX', city: 'Dallas', region: 'TX', country: 'USA' },
    { name: 'Austin, TX', city: 'Austin', region: 'TX', country: 'USA' },
  ]

  const createdLocations = await Promise.all(
    locations.map((location) =>
      prisma.location.upsert({
        where: { slug: generateSlug(location.name) },
        update: {},
        create: {
          ...location,
          slug: generateSlug(location.name),
        },
      })
    )
  )

  // Create tags
  console.log('Creating tags...')
  const tags = [
    'Family Friendly',
    'Pet Friendly',
    'Outdoor Seating',
    'Delivery Available',
    'Parking Available',
    'WiFi Available',
    'Wheelchair Accessible',
    'Open Late',
    'Budget Friendly',
    'Luxury',
  ]

  const createdTags = await Promise.all(
    tags.map((name) =>
      prisma.tag.upsert({
        where: { slug: generateSlug(name) },
        update: {},
        create: {
          name,
          slug: generateSlug(name),
        },
      })
    )
  )

  // Create sample listings
  console.log('Creating sample listings...')
  const listingTemplates = [
    {
      name: 'The Urban Bistro',
      description: 'A modern bistro offering farm-to-table cuisine in the heart of downtown. Our seasonal menu features locally sourced ingredients and creative dishes that blend traditional and contemporary flavors. Perfect for date nights, business lunches, or casual dining with friends.',
      websiteUrl: 'https://example.com/urban-bistro',
      contactEmail: 'info@urbanbistro.com',
      phone: '5551234567',
      categoryNames: ['Restaurants'],
      tagNames: ['Family Friendly', 'Outdoor Seating', 'Parking Available'],
    },
    {
      name: 'Sunrise Coffee Co.',
      description: 'Your neighborhood coffee shop serving artisanal espresso drinks and fresh pastries. We roast our own beans and create a welcoming atmosphere for remote work, casual meetings, or simply enjoying a great cup of coffee.',
      websiteUrl: 'https://example.com/sunrise-coffee',
      contactEmail: 'hello@sunrisecoffee.com',
      phone: '5552345678',
      categoryNames: ['Coffee Shops'],
      tagNames: ['WiFi Available', 'Outdoor Seating', 'Open Late'],
    },
    {
      name: 'Style & Thread Boutique',
      description: 'Curated fashion boutique featuring independent designers and sustainable brands. From everyday essentials to statement pieces, we offer personalized styling services and a carefully selected collection of clothing, accessories, and home goods.',
      websiteUrl: 'https://example.com/style-thread',
      contactEmail: 'shop@stylethread.com',
      phone: '5553456789',
      categoryNames: ['Retail Stores'],
      tagNames: ['Parking Available', 'Wheelchair Accessible'],
    },
    {
      name: 'Green Leaf Wellness Center',
      description: 'Holistic wellness center offering yoga classes, meditation sessions, massage therapy, and nutrition counseling. Our experienced practitioners create personalized wellness plans to help you achieve balance and vitality in your life.',
      websiteUrl: 'https://example.com/greenleaf',
      contactEmail: 'info@greenleafwellness.com',
      phone: '5554567890',
      categoryNames: ['Health & Wellness'],
      tagNames: ['Parking Available', 'Wheelchair Accessible'],
    },
    {
      name: 'TechFix Solutions',
      description: 'Professional IT services and computer repair for businesses and individuals. We offer on-site support, remote assistance, network setup, cybersecurity solutions, and hardware repair. Fast, reliable, and affordable service guaranteed.',
      websiteUrl: 'https://example.com/techfix',
      contactEmail: 'support@techfixsolutions.com',
      phone: '5555678901',
      categoryNames: ['Professional Services'],
      tagNames: [],
    },
  ]

  let listingCount = 0

  for (const location of createdLocations) {
    for (const template of listingTemplates) {
      const isFeatured = Math.random() > 0.7
      const name = `${template.name} - ${location.city}`
      const slug = generateSlug(name)

      const listing = await prisma.listing.create({
        data: {
          name,
          slug,
          description: template.description,
          websiteUrl: template.websiteUrl,
          contactEmail: template.contactEmail,
          phone: template.phone,
          locationId: location.id,
          status: 'APPROVED',
          isFeatured,
          categories: {
            create: template.categoryNames.map((categoryName) => {
              const category = createdCategories.find((c) => c.name === categoryName)!
              return {
                categoryId: category.id,
              }
            }),
          },
          tags: {
            create: template.tagNames.slice(0, Math.floor(Math.random() * 3) + 1).map((tagName) => {
              const tag = createdTags.find((t) => t.name === tagName)!
              return {
                tagId: tag.id,
              }
            }),
          },
        },
      })

      listingCount++
    }
  }

  // Create a few pending listings
  console.log('Creating pending listings...')
  const pendingListings = [
    {
      name: 'New Restaurant Submission',
      description: 'This is a pending listing awaiting approval.',
      locationId: createdLocations[0].id,
      categoryId: createdCategories[0].id,
    },
    {
      name: 'Pending Coffee Shop',
      description: 'Another pending listing for review.',
      locationId: createdLocations[1].id,
      categoryId: createdCategories[1].id,
    },
  ]

  for (const pending of pendingListings) {
    await prisma.listing.create({
      data: {
        name: pending.name,
        slug: generateSlug(pending.name),
        description: pending.description,
        contactEmail: 'pending@example.com',
        locationId: pending.locationId,
        status: 'PENDING',
        isFeatured: false,
        categories: {
          create: [{ categoryId: pending.categoryId }],
        },
      },
    })
    listingCount++
  }

  console.log(`✅ Seed completed!`)
  console.log(`   - Created ${createdCategories.length} categories`)
  console.log(`   - Created ${createdLocations.length} locations`)
  console.log(`   - Created ${createdTags.length} tags`)
  console.log(`   - Created ${listingCount} listings`)
  console.log(`   - Created 1 admin user (admin@example.com / changeme123)`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
