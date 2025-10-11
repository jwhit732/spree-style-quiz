import { NextRequest, NextResponse } from 'next/server'
import Airtable from 'airtable'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const primary = searchParams.get('primary')
    const secondary = searchParams.get('secondary')
    const tertiary = searchParams.get('tertiary')

    if (!primary) {
      return NextResponse.json(
        { error: 'Primary archetype is required' },
        { status: 400 }
      )
    }

    // Check if Airtable is configured
    if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
      console.error('❌ Airtable not configured')
      return NextResponse.json(
        { error: 'Airtable configuration missing' },
        { status: 500 }
      )
    }

    // Initialize Airtable
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
      .base(process.env.AIRTABLE_BASE_ID)

    const tableName = process.env.AIRTABLE_TABLE_NAME || 'Style Profiles'

    // Build the slug based on archetypes (matching your Airtable structure)
    let slug = primary
    if (secondary) slug += `-${secondary}`
    if (tertiary) slug += `-${tertiary}`

    console.log('🔍 Searching Airtable for slug:', slug)

    // Query Airtable using the slug field
    const records = await base(tableName)
      .select({
        filterByFormula: `{slug} = "${slug}"`,
        maxRecords: 1
      })
      .firstPage()

    if (records.length === 0) {
      // Fallback: Try without tertiary
      if (tertiary && secondary) {
        console.log('⚠️ No exact match found, trying without tertiary...')
        const fallbackSlug = `${primary}-${secondary}`
        const fallbackRecords = await base(tableName)
          .select({
            filterByFormula: `{slug} = "${fallbackSlug}"`,
            maxRecords: 1
          })
          .firstPage()

        if (fallbackRecords.length > 0) {
          const record = fallbackRecords[0]
          console.log('✅ Found fallback profile:', record.id)
          return NextResponse.json({
            id: record.id,
            fields: record.fields
          })
        }
      }

      // Final fallback: Try just primary archetype
      if (secondary || tertiary) {
        console.log('⚠️ No match found, trying primary only...')
        const primaryRecords = await base(tableName)
          .select({
            filterByFormula: `{slug} = "${primary}"`,
            maxRecords: 1
          })
          .firstPage()

        if (primaryRecords.length > 0) {
          const record = primaryRecords[0]
          console.log('✅ Found primary-only profile:', record.id)
          return NextResponse.json({
            id: record.id,
            fields: record.fields
          })
        }
      }

      return NextResponse.json(
        { error: 'Style profile not found' },
        { status: 404 }
      )
    }

    const record = records[0]
    console.log('✅ Found matching profile:', record.id)

    return NextResponse.json({
      id: record.id,
      fields: record.fields
    })

  } catch (error) {
    console.error('❌ Error fetching style profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch style profile' },
      { status: 500 }
    )
  }
}
