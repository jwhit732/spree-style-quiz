import { NextRequest, NextResponse } from 'next/server'
import { UserSubmission } from '@/types/quiz'

export async function POST(request: NextRequest) {
  try {
    const submission: UserSubmission = await request.json()
    
    // Validate the submission
    if (!submission.name || !submission.email || !submission.result) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

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

    // Send to ActiveCampaign
    const acResponse = await fetch(`${process.env.AC_BASE_URL}/api/3/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Token': process.env.AC_API_KEY || ''
      },
      body: JSON.stringify(activeCampaignData)
    })

    if (!acResponse.ok) {
      const errorData = await acResponse.text()
      console.error('ActiveCampaign API error:', errorData)
      
      // Still return success to user but log the error
      // In production, you might want to store failed submissions for retry
    }

    // Add tags if contact was created successfully
    if (acResponse.ok) {
      const contactData = await acResponse.json()
      const contactId = contactData.contact?.id
      
      if (contactId && tags.length > 0) {
        // Add tags to the contact
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
            }

            // Then add the tag to the contact
            if (tagId) {
              await fetch(`${process.env.AC_BASE_URL}/api/3/contactTags`, {
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
            }
          } catch (tagError) {
            console.error('Error adding tag:', tagError)
            // Continue with other tags even if one fails
          }
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
      message: 'Quiz results submitted successfully'
    })

  } catch (error) {
    console.error('Error processing quiz submission:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}