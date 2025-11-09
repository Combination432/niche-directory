import { PrismaClient } from '@prisma/client'
import { generateSlug } from '../src/lib/utils'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

/**
 * CSV Import Utility for Listings
 * 
 * CSV Format:
 * name,description,websiteUrl,contactEmail,phone,locationName,categoryNames,status,isFeatured
 * 
 * Example:
 * "Joe's Pizza","Best pizza in town","https://joespizza.com","joe@pizza.com","5551234567","New York, NY","Restaurants|Food","APPROVED","true"
 * 
 * Usage:
 * 1. Create a CSV file with your listings
 * 2. Place it in the root directory
 * 3. Run: tsx scripts/importListings.ts path/to/your/file.csv
 */

interface CSVRow {
  name: string
  description: string
  websiteUrl?: string
  contactEmail: string
  phone?: string
  locationName: string
  categoryNames: string // Pipe-separated: "Category1|Category2"
  status?: 'PENDING' | 'APPROVED' | 'REJECTED'
  isFeatured?: string
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current.trim())
  return result
}

async function importListingsFromCSV(filePath: string) {
  console.log('📥 Starting import from:', filePath)

  if (!fs.existsSync(filePath)) {
    console.error('❌ File not found:', filePath)
    process.exit(1)
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const lines = fileContent.split('\n').filter(line => line.trim())
  
  if (lines.length < 2) {
    console.error('❌ CSV file is empty or only contains headers')
    process.exit(1)
  }

  const headers = parseCSVLine(lines[0])
  console.log('📋 CSV Headers:', headers)

  let successCount = 0
  let errorCount = 0

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    const row: any = {}
    
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })

    try {
      // Find or create location
      let location = await prisma.location.findFirst({
        where: { name: row.locationName },
      })

      if (!location) {
        const locationSlug = generateSlug(row.locationName)
        location = await prisma.location.create({
          data: {
            name: row.locationName,
            slug: locationSlug,
          },
        })
        console.log(`  ✓ Created location: ${row.locationName}`)
      }

      // Find or create categories
      const categoryNames = row.categoryNames.split('|').map((c: string) => c.trim())
      const categories = []

      for (const categoryName of categoryNames) {
        let category = await prisma.category.findFirst({
          where: { name: categoryName },
        })

        if (!category) {
          const categorySlug = generateSlug(categoryName)
          category = await prisma.category.create({
            data: {
              name: categoryName,
              slug: categorySlug,
            },
          })
          console.log(`  ✓ Created category: ${categoryName}`)
        }

        categories.push(category)
      }

      // Generate unique slug
      let slug = generateSlug(row.name)
      let slugExists = await prisma.listing.findUnique({ where: { slug } })
      let counter = 1
      
      while (slugExists) {
        slug = `${generateSlug(row.name)}-${counter}`
        slugExists = await prisma.listing.findUnique({ where: { slug } })
        counter++
      }

      // Create listing
      await prisma.listing.create({
        data: {
          name: row.name,
          slug,
          description: row.description,
          websiteUrl: row.websiteUrl || null,
          contactEmail: row.contactEmail,
          phone: row.phone || null,
          locationId: location.id,
          status: row.status || 'PENDING',
          isFeatured: row.isFeatured === 'true',
          categories: {
            create: categories.map(cat => ({
              categoryId: cat.id,
            })),
          },
        },
      })

      console.log(`✅ Imported: ${row.name}`)
      successCount++
    } catch (error: any) {
      console.error(`❌ Error importing row ${i}:`, error.message)
      errorCount++
    }
  }

  console.log('\n📊 Import Summary:')
  console.log(`   ✅ Success: ${successCount}`)
  console.log(`   ❌ Errors: ${errorCount}`)
  console.log(`   📝 Total processed: ${lines.length - 1}`)
}

// Run the import
const csvFilePath = process.argv[2]

if (!csvFilePath) {
  console.error('❌ Please provide a CSV file path')
  console.log('Usage: tsx scripts/importListings.ts path/to/file.csv')
  process.exit(1)
}

importListingsFromCSV(csvFilePath)
  .catch((e) => {
    console.error('❌ Import failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
