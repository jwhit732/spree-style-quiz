# Quiz Embedding Guide: Vercel + Squarespace

Perfect strategy! This gives you the best of both worlds: modern React app performance with Squarespace traffic and branding.

## **Step 1: Deploy to Vercel (Free Plan)**

### Quick Deploy
```bash
cd "D:\Projects\OneDrive\Desktop\Coding_projects\Spree_Survey"
npx vercel --prod
```

**During setup:**
- Project name: `spree-style-quiz` 
- Link to existing project? **No**
- Deploy from current directory? **Yes**
- Override settings? **No**

**Result:** You'll get a URL like `https://spree-style-quiz-abc123.vercel.app`

### Set Environment Variables in Vercel

Go to your Vercel dashboard → Project → Settings → Environment Variables:

```
AC_API_KEY = your_activecampaign_api_key
AC_BASE_URL = https://your-account.api-us1.com  
AC_FIELD_PRIMARY_ARCHETYPE = 1
AC_FIELD_SECONDARY_ARCHETYPE = 2
AC_FIELD_QUIZ_RESULT = 3
AC_FIELD_QUIZ_DATE = 4
```

## **Step 2: Embed in Squarespace**

### Option A: Full Page Embed (Recommended)
Create a new page in Squarespace:

1. **Add Code Block** to page
2. **Paste this iframe code:**

```html
<div style="width: 100%; height: 100vh; margin: 0; padding: 0;">
  <iframe 
    src="https://your-vercel-url.vercel.app"
    width="100%" 
    height="100%"
    frameborder="0"
    scrolling="yes"
    style="border: none; min-height: 800px;"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    loading="lazy">
  </iframe>
</div>

<style>
  /* Hide Squarespace header/footer on this page if desired */
  .sqs-block-code iframe {
    display: block;
    margin: 0 auto;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .sqs-block-code iframe {
      min-height: 900px;
    }
  }
</style>
```

### Option B: Section Embed
For embedding within an existing page:

```html
<div style="width: 100%; height: 1200px; margin: 2rem 0; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
  <iframe 
    src="https://your-vercel-url.vercel.app"
    width="100%" 
    height="100%"
    frameborder="0"
    scrolling="yes"
    style="border: none;"
    loading="lazy">
  </iframe>
</div>
```

## **Step 3: Squarespace Page Setup**

### Page Settings:
- **Page Title:** "Discover Your Signature Style"
- **URL Slug:** `/style-quiz`
- **SEO Description:** "Take our free style quiz to discover your personal fashion archetype"
- **Header:** Hide or simplify for cleaner look
- **Footer:** Optional - can hide for seamless experience

### Optional Enhancements:
Add **intro text above** the iframe:
```html
<div style="text-align: center; margin-bottom: 2rem;">
  <p style="font-size: 1.2rem; color: #666; max-width: 600px; margin: 0 auto;">
    This free quiz helps uncover your authentic style – based on what you like, 
    how you see yourself, and how you want to be seen.
  </p>
</div>
```

## **Step 4: ActiveCampaign Setup**

### Create Custom Fields:
1. **Settings → Fields → Create New Field**

**Field 1: Primary Archetype**
- Field Type: Text
- Field Name: "Primary Style Archetype"
- Note the Field ID (e.g., "1")

**Field 2: Secondary Archetype**  
- Field Type: Text
- Field Name: "Secondary Style Archetype"

**Field 3: Quiz Result**
- Field Type: Text Area
- Field Name: "Complete Quiz Result"

**Field 4: Quiz Date**
- Field Type: Date
- Field Name: "Quiz Completion Date"

### Update Vercel Environment Variables
Add the Field IDs you got from ActiveCampaign to your Vercel environment variables.

## **Benefits of This Approach**

### ✅ **For You:**
- **Free hosting** (Vercel free tier: 100GB bandwidth)
- **No domain setup** required
- **Squarespace traffic** and SEO benefits
- **Professional embedding** with your branding
- **Easy updates** - just redeploy to Vercel

### ✅ **For Users:**
- **Fast loading** (Vercel's global CDN)
- **Seamless experience** within your site
- **Mobile optimized** responsiveness
- **No redirects** or external links

### ✅ **For Analytics:**
- **Squarespace traffic** counts toward your site
- **ActiveCampaign integration** captures leads
- **Can add Google Analytics** to both Squarespace and Vercel

## **Testing Before Launch**

1. **Deploy to Vercel** with environment variables
2. **Test quiz completion** - check ActiveCampaign for new contacts
3. **Embed in test Squarespace page**
4. **Test iframe responsiveness** on mobile/desktop
5. **Verify lead capture** is working

## **Expected Performance**

### **Vercel Free Tier Limits:**
- **Bandwidth:** 100GB/month (≈25,000 quiz completions)
- **Function Executions:** 100GB-hours (more than enough)
- **Builds:** 100 per month

### **When to Upgrade:**
- If you exceed 25k quiz takers/month
- Need custom domain (quiz.spreewithme.com)
- Want enhanced analytics

## **Launch Checklist**

- [ ] Deploy to Vercel production
- [ ] Set all environment variables  
- [ ] Test ActiveCampaign integration
- [ ] Create Squarespace page
- [ ] Embed iframe with correct URL
- [ ] Test mobile responsiveness
- [ ] Submit test quiz to verify flow
- [ ] Launch! 🚀

## **Estimated Timeline: 30 Minutes Total**
- Vercel deployment: 10 minutes
- ActiveCampaign setup: 10 minutes  
- Squarespace embedding: 10 minutes

**Perfect solution - professional React app with Squarespace simplicity!**