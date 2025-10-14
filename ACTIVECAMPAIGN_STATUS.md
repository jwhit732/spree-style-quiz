# ActiveCampaign Integration Status Report

**Last Updated:** October 15, 2025
**Status:** ✅ Basic integration active (Name, Email, Style Slug)

---

## Current Implementation

### What IS Working

The ActiveCampaign integration is **currently active** and will save the following data when users complete the quiz:

1. **Contact Email** - User's email address
2. **Contact First Name** - User's name from the form
3. **Style Slug** - The archetype combination (e.g., "creative-natural-bold")
   - Stored in custom field: `AC_FIELD_ARCHETYPE_COMBO` (Field ID: 50)
4. **Tags** - Automatic tagging based on quiz results:
   - Primary style: `Style: Creative` (capitalized archetype name)
   - Secondary style: `Secondary: Natural` (if applicable)

### Environment Variables Required

These are configured in Vercel and must remain set:

```env
AC_API_KEY=<your-activecampaign-api-key>
AC_BASE_URL=https://spreewithme.api-us1.com
AC_FIELD_ARCHETYPE_COMBO=50
```

### Code Location

- **Main API Route:** `src/app/api/submit-quiz/route.ts`
- **Lines 19-40:** ActiveCampaign configuration check and data preparation
- **Lines 88-230:** Contact creation, field updates, and tagging logic

---

## What Was Removed (Temporarily)

The following features were **commented out or removed** because the necessary field IDs or list IDs are not yet configured in Vercel. They can be easily reinstated when you have access to ActiveCampaign.

### 1. Additional Custom Fields

**Removed custom fields:**
- `AC_FIELD_PRIMARY_ARCHETYPE` - To store just the primary archetype (e.g., "creative")
- `AC_FIELD_SECONDARY_ARCHETYPE` - To store just the secondary archetype
- `AC_FIELD_QUIZ_RESULT` - To store the full description text
- `AC_FIELD_QUIZ_DATE` - To store the date the quiz was taken

**Why removed:** These were set to placeholder values (1, 2, 3, 4) which would cause API errors. The style slug (field 50) is sufficient for now.

### 2. List Subscription

**Removed feature:** Automatic subscription to an ActiveCampaign list

**Code that was removed (lines 106-133 in previous version):**
```typescript
// Subscribe to list if list ID is specified
if (contactId && process.env.AC_LIST_ID) {
  const listResponse = await fetch(`${process.env.AC_BASE_URL}/api/3/contactLists`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Token': process.env.AC_API_KEY || ''
    },
    body: JSON.stringify({
      contactList: {
        list: process.env.AC_LIST_ID,
        contact: contactId,
        status: 1 // 1 = subscribed
      }
    })
  })
}
```

**Why removed:** No `AC_LIST_ID` environment variable configured. You may want to add quiz participants to a specific list.

---

## How to Reinstate Removed Features

### Step 1: Get Field IDs from ActiveCampaign

1. Log into your ActiveCampaign account
2. Go to **Settings** → **Manage Fields**
3. Find or create the following custom fields:
   - **Primary Archetype** (text field)
   - **Secondary Archetype** (text field)
   - **Quiz Result** (textarea field)
   - **Quiz Date** (date field)
4. Note the **Field ID** for each (visible in the field settings or API)

### Step 2: Add Environment Variables to Vercel

Add these to your Vercel project environment variables:

```env
AC_FIELD_PRIMARY_ARCHETYPE=<field-id-from-step-1>
AC_FIELD_SECONDARY_ARCHETYPE=<field-id-from-step-1>
AC_FIELD_QUIZ_RESULT=<field-id-from-step-1>
AC_FIELD_QUIZ_DATE=<field-id-from-step-1>
AC_LIST_ID=<your-list-id>  # Optional: if you want auto-subscription
```

### Step 3: Update the Code

In `src/app/api/submit-quiz/route.ts`, around line 47, replace the `fieldValues` array with:

```typescript
fieldValues: [
  // Style slug (currently active)
  {
    field: process.env.AC_FIELD_ARCHETYPE_COMBO,
    value: styleSlug
  },
  // Add these back when field IDs are configured:
  {
    field: process.env.AC_FIELD_PRIMARY_ARCHETYPE,
    value: submission.result.primary
  },
  {
    field: process.env.AC_FIELD_SECONDARY_ARCHETYPE,
    value: submission.result.secondary || ''
  },
  {
    field: process.env.AC_FIELD_QUIZ_RESULT,
    value: submission.result.description
  },
  {
    field: process.env.AC_FIELD_QUIZ_DATE,
    value: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
  }
].filter(field => field.field) // Filter out any undefined field IDs
```

### Step 4: Re-enable List Subscription (Optional)

After line 91 (where the contact is successfully created), add:

```typescript
// Subscribe to list if list ID is specified
if (contactId && process.env.AC_LIST_ID) {
  try {
    console.log(`🔄 Adding contact to list ${process.env.AC_LIST_ID}...`)
    const listResponse = await fetch(`${process.env.AC_BASE_URL}/api/3/contactLists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Token': process.env.AC_API_KEY || ''
      },
      body: JSON.stringify({
        contactList: {
          list: process.env.AC_LIST_ID,
          contact: contactId,
          status: 1 // 1 = subscribed
        }
      })
    })

    if (listResponse.ok) {
      console.log('✅ Contact added to list successfully')
    } else {
      const listError = await listResponse.text()
      console.error('❌ Failed to add contact to list:', listError)
    }
  } catch (listError) {
    console.error('❌ Error adding contact to list:', listError)
  }
}
```

---

## Testing the Integration

### Test 1: Verify Contact Creation

**Goal:** Confirm that contacts are being created in ActiveCampaign

1. Complete the quiz at https://spreewithme.com/style-quiz
2. Enter a test email (e.g., `test+quiz1@yourdomain.com`)
3. Submit the form
4. Check Vercel logs (Runtime Logs in Vercel dashboard):
   - Look for: `✅ Successfully saved to ActiveCampaign!`
   - Note the Contact ID shown in logs
5. Log into ActiveCampaign
6. Go to **Contacts** and search for the test email
7. Verify the contact exists

### Test 2: Verify Custom Field is Populated

**Goal:** Confirm the style slug is being saved to field 50

1. In ActiveCampaign, open the test contact from Test 1
2. Look for the custom field that has ID 50 (AC_FIELD_ARCHETYPE_COMBO)
3. Verify it contains the style combination (e.g., "creative-natural-bold")

### Test 3: Verify Tags are Applied

**Goal:** Confirm automatic tagging is working

1. In ActiveCampaign, open the test contact
2. Check the **Tags** section
3. Verify you see tags like:
   - `Style: Creative`
   - `Secondary: Natural` (if applicable)

### Test 4: Check Error Handling

**Goal:** Verify the system handles failures gracefully

1. Temporarily set an incorrect API key in Vercel (add one wrong character)
2. Complete the quiz with a new test email
3. Check Vercel logs - you should see:
   - `❌ ActiveCampaign API error:` with details
   - `💾 Storing submission locally due to AC error:`
4. **Important:** The quiz should still complete and show the style profile
5. Restore the correct API key in Vercel

### Test 5: End-to-End Flow

**Goal:** Test the complete user journey

1. Start at https://spreewithme.com/style-quiz
2. Complete all quiz questions
3. Enter name and email on results page
4. Submit and verify redirect to style profile page
5. Check that the style profile displays correctly
6. Check ActiveCampaign for the new contact
7. Verify all data was saved correctly

---

## Troubleshooting

### Issue: Contacts not appearing in ActiveCampaign

**Possible causes:**
1. API key is incorrect or expired
2. Base URL is wrong (should be `https://spreewithme.api-us1.com`)
3. Rate limiting from ActiveCampaign

**How to diagnose:**
- Check Vercel Runtime Logs for error messages
- Look for `❌ ActiveCampaign API error:` in logs
- Verify API key has not been regenerated in ActiveCampaign

### Issue: Custom field not showing style slug

**Possible causes:**
1. Field ID 50 doesn't exist or is wrong
2. Field type in ActiveCampaign doesn't accept text

**How to fix:**
1. Log into ActiveCampaign
2. Go to Settings → Manage Fields
3. Find the field that should store the style combination
4. Note its Field ID
5. Update `AC_FIELD_ARCHETYPE_COMBO` in Vercel to match

### Issue: Tags not being created

**Possible causes:**
1. Tagging logic is running but tags may be created with different names
2. API permissions issue

**How to diagnose:**
- Check logs for `🏷️ Adding tags to contact:`
- Look for `✅ Added tag` confirmation messages
- Check if any error messages about tags appear

---

## API Documentation References

- **ActiveCampaign API Docs:** https://developers.activecampaign.com/
- **Contacts API:** https://developers.activecampaign.com/reference/create-contact
- **Custom Fields:** https://developers.activecampaign.com/reference/update-a-custom-field-value-for-contact
- **Tags API:** https://developers.activecampaign.com/reference/create-a-new-tag
- **Lists API:** https://developers.activecampaign.com/reference/subscribe-a-contact

---

## Current Limitations

1. **No list subscription** - Contacts are created but not added to any specific list
2. **Minimal custom fields** - Only style slug is stored, not individual archetype components
3. **No quiz date tracking** - The date the quiz was taken is not stored
4. **No automation triggers** - Would need to be set up in ActiveCampaign based on tags or custom field values

## Future Enhancements to Consider

1. **Add quiz completion date** field for tracking
2. **Store individual archetype scores** if scoring logic provides them
3. **Integration with ActiveCampaign automations** - trigger email sequences based on style type
4. **Webhook notifications** to ActiveCampaign when quiz is completed
5. **Conditional list assignment** - add to different lists based on primary archetype
6. **Double opt-in flow** - send confirmation email via ActiveCampaign

---

**Note:** This integration is designed to fail gracefully. If ActiveCampaign is unavailable, the quiz will still work and show results to users, but contact data won't be saved to ActiveCampaign (it will only appear in server logs).
