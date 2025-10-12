# ActiveCampaign Integration Setup

This guide explains how to configure ActiveCampaign to receive quiz submissions.

## Overview

When a user completes the quiz and enters their email, the system will:
1. Submit their information to ActiveCampaign
2. Add them to a specified list (optional)
3. Set custom fields with their style results
4. Add tags based on their primary and secondary style archetypes
5. Redirect them to their personalized style profile page

## Environment Variables Required

Add these to your `.env.local` file:

```env
# ActiveCampaign API credentials
AC_API_KEY=your_api_key_here
AC_BASE_URL=https://your-account.api-us1.com

# List ID (optional - if you want to add contacts to a specific list)
AC_LIST_ID=1

# Custom Field IDs (get these from ActiveCampaign)
AC_FIELD_PRIMARY_ARCHETYPE=1
AC_FIELD_SECONDARY_ARCHETYPE=2
AC_FIELD_QUIZ_RESULT=3
AC_FIELD_QUIZ_DATE=4
AC_FIELD_STYLE_SLUG=5
```

## Step 1: Get Your API Credentials

1. Log in to ActiveCampaign
2. Go to **Settings** > **Developer**
3. Copy your **API URL** (e.g., `https://youraccountname.api-us1.com`)
4. Copy your **API Key**

Set these as `AC_BASE_URL` and `AC_API_KEY` in your environment variables.

## Step 2: Get Your List ID (Optional)

If you want to automatically add quiz participants to a specific list:

1. Go to **Contacts** > **Lists**
2. Click on the list you want to use
3. Look at the URL - the number at the end is your List ID
   - Example: `https://youraccountname.activehosted.com/app/contacts/?listid=1` → List ID is `1`

Set this as `AC_LIST_ID` in your environment variables.

## Step 3: Create Custom Fields

Create custom fields in ActiveCampaign to store the quiz results:

1. Go to **Contacts** > **Manage Fields**
2. Click **Add Custom Field**
3. Create the following fields:

### Primary Archetype
- **Field Type:** Text Input
- **Field Label:** Primary Style Archetype
- **Personalization Tag:** `%PRIMARY_ARCHETYPE%`
- Note the Field ID (you'll see it in the URL or field list)

### Secondary Archetype
- **Field Type:** Text Input
- **Field Label:** Secondary Style Archetype
- **Personalization Tag:** `%SECONDARY_ARCHETYPE%`

### Quiz Result Description
- **Field Type:** Textarea
- **Field Label:** Quiz Result Description
- **Personalization Tag:** `%QUIZ_RESULT%`

### Quiz Date
- **Field Type:** Date
- **Field Label:** Quiz Completion Date
- **Personalization Tag:** `%QUIZ_DATE%`

### Style Slug
- **Field Type:** Text Input
- **Field Label:** Style Slug
- **Personalization Tag:** `%STYLE_SLUG%`
- **Description:** Combined archetype identifier (e.g., "natural-romantic-bold")

## Step 4: Set Field IDs

After creating each field, get its ID:

1. Go to **Settings** > **Manage Fields**
2. Click on each field to edit it
3. Look at the URL - the number is your Field ID
   - Example: `https://youraccountname.activehosted.com/app/fields/edit/123` → Field ID is `123`

Update your environment variables with the correct Field IDs:

```env
AC_FIELD_PRIMARY_ARCHETYPE=123
AC_FIELD_SECONDARY_ARCHETYPE=124
AC_FIELD_QUIZ_RESULT=125
AC_FIELD_QUIZ_DATE=126
AC_FIELD_STYLE_SLUG=127
```

## Step 5: Test the Integration

1. Make sure all environment variables are set in `.env.local`
2. Restart your development server
3. Complete the quiz and submit your email
4. Check the console logs for success/error messages
5. Verify the contact appears in ActiveCampaign with all custom fields populated

## What Gets Sent to ActiveCampaign

For each submission, the system sends:

### Contact Information
- **Email:** User's email address
- **First Name:** User's name

### Custom Fields
- **Primary Archetype:** The user's dominant style (e.g., "natural")
- **Secondary Archetype:** The user's secondary style influence (e.g., "romantic")
- **Quiz Result Description:** Full description text (e.g., "You're mostly Natural with Romantic influences.")
- **Quiz Date:** Date the quiz was completed (YYYY-MM-DD format)
- **Style Slug:** Combined identifier for Airtable lookup (e.g., "natural-romantic-bold")

### Tags
- `Style: [Primary]` (e.g., "Style: Natural")
- `Secondary: [Secondary]` (e.g., "Secondary: Romantic")

### List Subscription
- If `AC_LIST_ID` is set, the contact will be added to that list with status "subscribed"

## Style Slug Format

The style slug is a hyphen-separated combination of archetypes, used to match with Airtable records:

- Primary only: `natural`
- Primary + Secondary: `natural-romantic`
- Primary + Secondary + Tertiary: `natural-romantic-bold`

This matches the slug format used in your Airtable Style Profiles table.

## Troubleshooting

### Contact not appearing in ActiveCampaign

1. Check server logs for error messages
2. Verify your API credentials are correct
3. Make sure your API key has proper permissions
4. Check that field IDs match your ActiveCampaign custom fields

### Custom fields not populated

1. Verify Field IDs are correct in your `.env.local`
2. Check that custom fields exist in ActiveCampaign
3. Look at server logs for any API errors

### Contact not added to list

1. Verify `AC_LIST_ID` is set and correct
2. Check that the list exists and is active
3. Review server logs for list subscription errors

## Development Mode

If ActiveCampaign credentials are not configured (`AC_API_KEY` and `AC_BASE_URL` are missing), the system will:
- Log submission data to the console
- Still allow users to complete the quiz
- Show their results normally
- Return a success response indicating "development mode"

This allows you to test the quiz flow without ActiveCampaign configured.
