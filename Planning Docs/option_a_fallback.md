# Option A: Squarespace Code Block Fallback Plan

## Overview
Simple HTML/CSS/JS implementation that can be directly embedded in Squarespace via Code Block.

## Technical Specification

### Structure
- **Single HTML file** with embedded CSS and JavaScript
- **Progressive enhancement** approach
- **Mobile-first responsive design**
- **Vanilla JavaScript** (no framework dependencies)

### Features
- Multi-step quiz flow (7 questions)
- Progress bar with smooth animations
- Card-based question layouts
- Image grid for style vibe selection (Q7)
- Form validation and submission
- Loading states and micro-interactions
- Direct ActiveCampaign form integration

### Implementation Details

#### File Structure
```
spree-quiz.html (single file containing everything)
├── Embedded CSS (<style> tags)
├── HTML structure
├── Embedded JavaScript (<script> tags)
└── ActiveCampaign form integration
```

#### Key Components
1. **Quiz Navigation**
   - Next/Back buttons with validation
   - Progress tracking (1 of 7, 2 of 7, etc.)
   - Smooth transitions using CSS transforms

2. **Question Types**
   - Single choice (radio buttons styled as cards)
   - Multi-choice with limit (Q5 - max 6 selections)
   - Image selection (Q7 - visual grid)

3. **Results Calculation**
   - Simple scoring based on primary archetype
   - Template-based result generation
   - 6 possible primary results only

4. **ActiveCampaign Integration**
   - Embedded form at final step
   - Hidden field for quiz result
   - Direct submission to AC

### Styling Approach
- **Tailwind-inspired utility classes** (custom CSS)
- **CSS Grid and Flexbox** for layouts
- **CSS Custom Properties** for theming
- **Mobile-first breakpoints**
- **Smooth animations** using CSS transitions

### Content Requirements
- 6 primary archetype descriptions (~100 words each)
- Universal styling tips section
- Welcome/instruction text
- Form labels and validation messages

### Deployment
1. **Copy/paste** into Squarespace Code Block
2. **Test** on mobile and desktop
3. **Connect** ActiveCampaign form
4. **Monitor** submissions and user flow

### Pros
- **Simple deployment** (copy/paste)
- **No external dependencies**
- **Fast loading** (single file)
- **Easy to maintain**
- **Low cost** (no hosting)

### Cons
- **Limited animations** compared to React
- **Harder to extend** for complex features
- **CSS/JS size** constraints in Squarespace
- **Less sophisticated** user interactions

### Timeline
- **Week 1**: Build HTML structure and basic styling
- **Week 2**: Add JavaScript interactions and AC integration
- **Week 3**: Testing, refinement, and deployment

### Estimated Cost
- **Development**: $500-1,000
- **Hosting**: $0 (uses Squarespace)
- **Maintenance**: Minimal

---

## When to Use Option A
- If Option B becomes too complex
- If timeline is very tight
- If budget constraints require simpler approach
- If Vercel deployment faces issues
- If client prefers everything within Squarespace

This option provides 80% of the user experience with 20% of the complexity.