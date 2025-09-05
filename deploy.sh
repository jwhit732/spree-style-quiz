#!/bin/bash

echo "🚀 Deploying Spree Style Quiz to Vercel..."

# Build the app first to check for errors
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed. Please fix errors before deploying."
  exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
npx vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Set environment variables in Vercel dashboard"
echo "2. Test the deployed URL"  
echo "3. Embed in Squarespace using the iframe code"
echo ""
echo "See EMBED_GUIDE.md for detailed instructions!"