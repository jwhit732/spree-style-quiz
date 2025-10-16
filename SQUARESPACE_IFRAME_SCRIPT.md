# Squarespace Iframe Auto-Resize Script

## Instructions

Add this script to your Squarespace page where the quiz iframe is embedded.

**Steps:**
1. Go to your Squarespace page editor
2. Find the Code Block where your quiz iframe is embedded
3. Add this script **after** your iframe code

## Script to Add

```html
<script>
(function() {
  // Find the quiz iframe (adjust the selector if needed)
  const iframe = document.querySelector('iframe[src*="spreewithme.com/style-quiz"], iframe[src*="vercel.app"]');

  if (!iframe) {
    console.warn('Quiz iframe not found');
    return;
  }

  // Listen for height messages from the iframe
  window.addEventListener('message', function(event) {
    // Security: check origin if needed
    // if (event.origin !== 'https://spreewithme.com') return;

    if (event.data && event.data.type === 'iframeResize') {
      const newHeight = event.data.height;

      if (newHeight && newHeight > 0) {
        iframe.style.height = newHeight + 'px';

        // Scroll to top of iframe when height changes
        iframe.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });

  // Set initial minimum height
  iframe.style.minHeight = '600px';
  iframe.style.width = '100%';
  iframe.style.border = 'none';
  iframe.style.overflow = 'hidden';
})();
</script>
```

## Alternative: If you need to target a specific iframe

If you have multiple iframes on your page, use a more specific selector:

```html
<script>
(function() {
  // Give your iframe an ID for easier targeting
  const iframe = document.getElementById('style-quiz-iframe');

  // Rest of the code stays the same...
})();
</script>
```

And add an ID to your iframe:
```html
<iframe id="style-quiz-iframe" src="https://spreewithme.com/style-quiz" ...></iframe>
```

## How It Works

1. **Quiz app** (Next.js) sends its height to the parent window using `postMessage`
2. **Squarespace page** receives the message and resizes the iframe accordingly
3. **Height updates** happen automatically when:
   - Quiz loads
   - User moves to next/previous question
   - Content changes
   - Window resizes

This eliminates the white space and ensures smooth scrolling!

## Troubleshooting

If it's not working:
1. Check browser console for errors
2. Verify the iframe selector matches your iframe
3. Make sure both scripts are loaded
4. Check if Content Security Policy is blocking postMessage

## Security Note

The current setup uses `'*'` as the origin for postMessage. For production, you may want to restrict this to your specific domain:

```javascript
// In Next.js app (layout.tsx):
window.parent.postMessage({...}, 'https://spreewithme.com');

// In Squarespace script:
if (event.origin !== 'https://spreewithme.com') return;
```
