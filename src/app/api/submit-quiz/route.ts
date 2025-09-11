import { NextRequest, NextResponse } from 'next/server'
import { UserSubmission } from '@/types/quiz'
import { generateArchetypeCombinationId } from '@/utils/scoring'

export async function POST(request: NextRequest) {
  console.log('🚀 Quiz submission received!')
  try {
    const submission: UserSubmission = await request.json()
    console.log('📝 Submission data:', submission)
    
    // Validate the submission
    if (!submission.name || !submission.email || !submission.result) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if ActiveCampaign is configured
    const isActiveCampaignConfigured = !!(
      process.env.AC_API_KEY && 
      process.env.AC_BASE_URL
    )

    if (!isActiveCampaignConfigured) {
      // Store submission locally for now (development mode)
      console.log('📋 Quiz Submission (ActiveCampaign not configured):', {
        name: submission.name,
        email: submission.email,
        result: submission.result.description,
        timestamp: submission.timestamp
      })

      return NextResponse.json({ 
        success: true,
        message: 'Quiz results submitted successfully (stored locally)',
        mode: 'development'
      })
    }

    let activeCampaignSuccess = false

    // Prepare data for ActiveCampaign
    const activeCampaignData = {
      contact: {
        email: submission.email,
        firstName: submission.name,
        // Custom fields for quiz results
        fieldValues: [
          {
            field: process.env.AC_FIELD_PRIMARY_ARCHETYPE || '1', // You'll get this ID from ActiveCampaign
            value: submission.result.primary
          },
          {
            field: process.env.AC_FIELD_SECONDARY_ARCHETYPE || '2',
            value: submission.result.secondary || ''
          },
          {
            field: process.env.AC_FIELD_QUIZ_RESULT || '3',
            value: submission.result.description
          },
          {
            field: process.env.AC_FIELD_QUIZ_DATE || '4',
            value: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
          },
          {
            field: process.env.AC_FIELD_ARCHETYPE_COMBO || '5',
            value: generateArchetypeCombinationId(submission.result)
          }
        ]
      }
    }

    // Add tags based on the archetype
    const tags = [
      `Style: ${submission.result.primary.charAt(0).toUpperCase() + submission.result.primary.slice(1)}`
    ]
    if (submission.result.secondary) {
      tags.push(`Secondary: ${submission.result.secondary.charAt(0).toUpperCase() + submission.result.secondary.slice(1)}`)
    }

    // Try to send to ActiveCampaign
    let contactId: string | undefined
    
    try {
      console.log('🔄 Attempting to send to ActiveCampaign...')
      const acResponse = await fetch(`${process.env.AC_BASE_URL}/api/3/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Token': process.env.AC_API_KEY || ''
        },
        body: JSON.stringify(activeCampaignData)
      })

      if (acResponse.ok) {
        const contactData = await acResponse.json()
        contactId = contactData.contact?.id
        console.log('✅ Successfully sent to ActiveCampaign, contact ID:', contactId)
        activeCampaignSuccess = true
      } else {
        const errorData = await acResponse.text()
        console.error('❌ ActiveCampaign API error:', {
          status: acResponse.status,
          statusText: acResponse.statusText,
          error: errorData,
          url: `${process.env.AC_BASE_URL}/api/3/contacts`,
          apiKeyPrefix: process.env.AC_API_KEY?.substring(0, 8) + '...'
        })
        
        // Log the submission locally as fallback
        console.log('💾 Storing submission locally due to AC error:', {
          name: submission.name,
          email: submission.email,
          result: submission.result.description,
          timestamp: submission.timestamp,
          reason: 'ActiveCampaign API error'
        })
      }
    } catch (error) {
      console.error('❌ ActiveCampaign request failed:', error)
      console.log('💾 Storing submission locally due to AC connection error:', {
        name: submission.name,
        email: submission.email,
        result: submission.result.description,
        timestamp: submission.timestamp,
        reason: 'ActiveCampaign connection error'
      })
    }

    // Add tags if contact was created successfully
    if (activeCampaignSuccess && contactId && tags.length > 0) {
      console.log('🏷️ Adding tags to contact:', tags)
      
      for (const tagName of tags) {
        try {
          // First, create or get the tag
          const tagResponse = await fetch(`${process.env.AC_BASE_URL}/api/3/tags`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Api-Token': process.env.AC_API_KEY || ''
            },
            body: JSON.stringify({
              tag: {
                tag: tagName,
                tagType: 'contact'
              }
            })
          })

          let tagId
          if (tagResponse.ok) {
            const tagData = await tagResponse.json()
            tagId = tagData.tag?.id
          } else {
            // Tag might already exist, try to find it
            const existingTagResponse = await fetch(`${process.env.AC_BASE_URL}/api/3/tags?search=${encodeURIComponent(tagName)}`, {
              headers: {
                'Api-Token': process.env.AC_API_KEY || ''
              }
            })
            
            if (existingTagResponse.ok) {
              const existingTagData = await existingTagResponse.json()
              tagId = existingTagData.tags?.[0]?.id
            }
          }

          // Then add the tag to the contact
          if (tagId) {
            const contactTagResponse = await fetch(`${process.env.AC_BASE_URL}/api/3/contactTags`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Api-Token': process.env.AC_API_KEY || ''
              },
              body: JSON.stringify({
                contactTag: {
                  contact: contactId,
                  tag: tagId
                }
              })
            })
            
            if (contactTagResponse.ok) {
              console.log(`✅ Added tag "${tagName}" to contact`)
            } else {
              console.error(`❌ Failed to add tag "${tagName}" to contact`)
            }
          }
        } catch (tagError) {
          console.error(`Error adding tag "${tagName}":`, tagError)
          // Continue with other tags even if one fails
        }
      }
    }

    // Store submission locally as backup (optional)
    console.log('Quiz submission:', {
      name: submission.name,
      email: submission.email,
      result: submission.result.description,
      timestamp: submission.timestamp
    })

    return NextResponse.json({ 
      success: true,
      message: activeCampaignSuccess 
        ? 'Quiz results submitted successfully' 
        : 'Quiz results submitted successfully (stored locally)',
      activeCampaignStatus: activeCampaignSuccess ? 'success' : 'failed'
    })

  } catch (error) {
    console.error('Error processing quiz submission:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}