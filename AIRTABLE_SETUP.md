# Airtable Setup Guide for Style Profile Integration

This guide will help you set up your Airtable base to work with the style profile feature.

## Step 1: Get Your Airtable API Key

1. Go to https://airtable.com/account
2. In the "API" section, click "Generate API key" (or copy your existing key)
3. Copy your API key

## Step 2: Get Your Base ID

1. Go to https://airtable.com/api
2. Select your base that contains the Style Profiles
3. The Base ID will be shown in the URL or in the API documentation
   - It looks like: `appXXXXXXXXXXXXXX`

## Step 3: Set Up Your Environment Variables

Create a `.env.local` file in your project root (if you don't have one already) and add:

```bash
AIRTABLE_API_KEY=your_api_key_here
AIRTABLE_BASE_ID=your_base_id_here
AIRTABLE_TABLE_NAME=Style Profiles
```

## Step 4: Structure Your Airtable Table

Your Airtable table should have the following fields (column names):

### Required Fields:
- **Primary** (Single line text) - The primary archetype (e.g., "natural", "classic", "bold", "creative", "rebellious", "romantic")
- **Secondary** (Single line text) - The secondary archetype (can be empty)

### Recommended Fields:
- **Title** (Single line text) - The title for this profile (e.g., "The Natural Classic")
- **Description** (Long text) - Main description of this style combination
- **KeyCharacteristics** (Long text) - Bullet points or paragraphs about key characteristics
- **ColorPalette** (Long text) - Recommended colors for this style
- **FabricSuggestions** (Long text) - Recommended fabric types
- **StyleTips** (Long text) - Specific styling advice
- **ShoppingGuide** (Long text) - Where and what to shop for
- **CelebrityExamples** (Long text) - Celebrity style icons with this archetype

### Optional Fields:
You can add any additional fields you want - they'll be available in the profile data but won't be displayed unless you update the page template.

## Step 5: Populate Your Table

Create records for each possible combination of archetypes. For example:

| Primary | Secondary | Title | Description |
|---------|-----------|-------|-------------|
| natural | | The Pure Natural | Your style is effortlessly authentic... |
| natural | classic | The Natural Classic | You blend comfort with structure... |
| classic | bold | The Bold Classic | You love timeless pieces with a statement... |

### Possible Archetypes:
- natural
- classic
- bold
- creative
- rebellious
- romantic

**Note:** The `Primary` and `Secondary` fields should use lowercase values to match the quiz output.

## Step 6: Test Your Integration

1. Make sure your `.env.local` file is set up correctly
2. Restart your development server: `npm run dev`
3. Complete the quiz and submit your email
4. You should be redirected to your personalised style profile page

## Troubleshooting

### "Airtable configuration missing" error
- Check that your `.env.local` file has the correct variable names
- Restart your development server after adding environment variables

### "Style profile not found" error
- Check that your Primary and Secondary values in Airtable match exactly (they should be lowercase)
- Make sure you have at least one record for each primary archetype
- Check the server console logs for more details

### Profile loads but shows "undefined" or missing content
- Check that your field names in Airtable match exactly (case-sensitive)
- Common field names: `Title`, `Description`, `KeyCharacteristics`, etc.

## Optional: Customize the Profile Page

To add or remove sections from the profile page, edit:
`src/app/style-profile/page.tsx`

Look for the sections like:
```tsx
{fields.YourFieldName && (
  <motion.div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
    <h3>Your Section Title</h3>
    <div>{fields.YourFieldName}</div>
  </motion.div>
)}
```

You can duplicate these blocks and change `YourFieldName` to match your Airtable field names.
