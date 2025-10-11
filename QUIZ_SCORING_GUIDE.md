# Quiz Scoring Guide

This document explains how the style quiz calculates archetype scores and determines the final style profile.

## Style Archetypes

There are **6 style archetypes**:
- **Natural** - Ease, authenticity, comfort
- **Classic** - Structure, timelessness, simplicity
- **Bold** - Statement pieces, vibrant energy, confidence
- **Creative** - Experimentation, unique combinations
- **Rebellious** - Rule-breaking, edgy, unconventional
- **Romantic** - Graceful, soft, pretty

## Question Weights

Different questions have different weights in calculating the final score:

| Question | Weight | Rationale |
|----------|--------|-----------|
| Jewelry | 3 | Strong style indicator |
| Colors | 3 | Strong style indicator |
| Fabrics | 3 | Strong style indicator |
| Grooming | 3 | Strong style indicator |
| Personality | 1 per selection | Multiple selections allowed (up to 3) |
| Outfits | 3 | Strong style indicator |
| Vibes (Visual) | 4 | **Highest weight** - visual preference is strongest indicator |

**Total possible points per archetype:** ~22 points (varies based on personality selections)

---

## Question-by-Answer Mapping

### Question 1: Jewelry Preferences
**Weight: 3 points**

| Answer | Archetype | Description |
|--------|-----------|-------------|
| A | Romantic | Delicate, feminine jewelry |
| B | Bold | Statement, eye-catching pieces |
| C | Classic | Simple, timeless jewelry |
| D | Natural | Minimal or no jewelry |
| E | Rebellious | Edgy, unconventional pieces |
| F | Creative | Unique, artistic jewelry |

---

### Question 2: Color Preferences
**Weight: 3 points**

| Answer | Archetype | Description |
|--------|-----------|-------------|
| A | Rebellious | Dark, moody colors (black, charcoal, deep red) |
| B | Romantic | Soft, feminine colors (blush, lavender, cream) |
| C | Classic | Neutral, timeless colors (navy, white, beige, gray) |
| D | Bold | Vibrant, attention-grabbing colors (red, cobalt, emerald) |
| E | Natural | Earthy, organic colors (olive, rust, sand, denim) |
| F | Creative | Unexpected, artistic color combinations |

---

### Question 3: Fabric Preferences
**Weight: 3 points**

| Answer | Archetype | Description |
|--------|-----------|-------------|
| A | Classic | Structured fabrics (tailored wool, crisp cotton) |
| B | Romantic | Soft, flowing fabrics (silk, chiffon, lace) |
| C | Romantic | Delicate, feminine fabrics |
| D | Rebellious | Edgy fabrics (leather, distressed denim, metal accents) |
| E | Bold | Luxe, statement fabrics (velvet, satin, sequins) |
| F | Creative | Unconventional textures and mixed materials |

---

### Question 4: Grooming Style
**Weight: 3 points**

| Answer | Archetype | Description |
|--------|-----------|-------------|
| A | Classic | Polished, clean, timeless grooming |
| B | Romantic | Soft, pretty, feminine styling |
| C | Creative | Experimental, artistic styling |
| D | Rebellious | Edgy, bold, unconventional styling |
| E | Natural | Minimal, effortless, low-maintenance |
| F | Bold | Dramatic, attention-getting styling |

---

### Question 5: Personality Traits
**Weight: 1 point per selection** (users can select up to 3)

This is a multi-select question where users choose traits that describe them.

| Answer ID | Archetype | Personality Trait |
|-----------|-----------|-------------------|
| a1 | Classic | Organized, reliable, values tradition |
| a2 | Natural | Easygoing, authentic, unpretentious |
| a3 | Romantic | Sentimental, gentle, values beauty |
| a4 | Bold | Confident, outgoing, energetic |
| a5 | Creative | Artistic, curious, imaginative |
| a6 | Rebellious | Independent, nonconformist, daring |
| b1 | Bold | Ambitious, takes charge |
| b2 | Natural | Grounded, practical |
| b3 | Bold | Competitive, driven |
| b4 | Romantic | Empathetic, nurturing |
| b5 | Classic | Detail-oriented, precise |
| b6 | Creative | Open-minded, flexible |
| c1 | Rebellious | Questions norms, challenges status quo |
| c2 | Natural | Values simplicity, authenticity |
| c3 | Classic | Respects structure, tradition |
| c4 | Romantic | Values connection, harmony |
| c5 | Creative | Embraces change, innovation |
| c6 | Bold | Takes risks, seeks excitement |

**Note:** Users select 3 traits total, earning 1 point per selection for the corresponding archetype.

---

### Question 6: Outfit Preferences
**Weight: 3 points**

| Answer | Archetype | Description |
|--------|-----------|-------------|
| A | Romantic | Feminine, soft, flowy outfits |
| B | Rebellious | Edgy, bold, unconventional looks |
| C | Classic | Timeless, polished, structured outfits |
| D | Creative | Unique, artistic, mixed-pattern combinations |
| E | Bold | Statement-making, attention-grabbing outfits |
| F | Natural | Comfortable, relaxed, effortless style |

---

### Question 7: Visual Vibes (Highest Weight)
**Weight: 4 points** ⭐ **Most Important Question**

This question shows visual mood boards and carries the highest weight.

| Answer | Archetype | Visual Description |
|--------|-----------|-------------------|
| A | Rebellious | Dark, edgy, rule-breaking aesthetic |
| B | Romantic | Soft, dreamy, feminine aesthetic |
| C | Bold | Vibrant, powerful, statement aesthetic |
| D | Classic | Clean, timeless, structured aesthetic |
| E | Creative | Eclectic, artistic, experimental aesthetic |
| F | Natural | Organic, effortless, authentic aesthetic |

---

## Score Calculation Logic

### Step 1: Calculate Raw Scores
Sum up all points for each archetype based on the user's answers and the weights above.

**Example:**
```
Natural: 0 points
Classic: 6 points (2 questions × 3 weight)
Bold: 12 points (3 questions × 3 weight + 1 visual × 4 weight)
Creative: 3 points (1 question × 3 weight)
Rebellious: 0 points
Romantic: 7 points (2 questions × 3 weight + 1 trait × 1 weight)
```

### Step 2: Determine Primary Archetype
The archetype with the **highest score** becomes the primary.

**Example:** Bold (12 points) = Primary

### Step 3: Determine Secondary Archetype
The second-highest scoring archetype becomes secondary **IF** it meets the threshold:
- **Secondary must score ≥ 30% of the primary score**

**Formula:** `secondary_score >= primary_score × 0.3`

**Example:**
- Primary (Bold): 12 points
- Second highest (Romantic): 7 points
- Threshold: 12 × 0.3 = 3.6 points
- ✅ 7 ≥ 3.6, so Romantic qualifies as secondary

### Step 4: Determine Tertiary Archetype
The third-highest scoring archetype becomes tertiary **IF** it meets the threshold:
- **Tertiary must score ≥ 20% of the primary score**

**Formula:** `tertiary_score >= primary_score × 0.2`

**Example:**
- Primary (Bold): 12 points
- Third highest (Classic): 6 points
- Threshold: 12 × 0.2 = 2.4 points
- ✅ 6 ≥ 2.4, so Classic qualifies as tertiary

### Step 5: Generate Description
The final description is constructed based on which archetypes qualified:

| Combination | Description Format |
|-------------|-------------------|
| Primary only | "You're mostly [Primary]." |
| Primary + Secondary | "You're mostly [Primary] with [Secondary] influences." |
| Primary + Secondary + Tertiary | "You're mostly [Primary] with [Secondary] influences and an element of [Tertiary]." |

**Example Result:**
- **Primary:** Bold
- **Secondary:** Romantic
- **Tertiary:** Classic
- **Description:** "You're mostly Bold with Romantic influences and an element of Classic."
- **Airtable Slug:** `bold-romantic-classic`

---

## Archetype Combinations

With 6 archetypes and support for primary, secondary, and tertiary, there are:
- **6** single-archetype profiles (primary only)
- **30** two-archetype profiles (primary + secondary)
- **120** three-archetype profiles (primary + secondary + tertiary)

**Total:** 156 possible combinations (though the quiz documentation mentions 155, likely excluding one edge case)

---

## Updating the Quiz

### To Change Question Weights

Edit `src/utils/scoring.ts` and modify the `questionWeights` object:

```typescript
const questionWeights = {
  jewelry: 3,
  colors: 3,
  fabrics: 3,
  grooming: 3,
  personality: 1,
  outfits: 3,
  vibes: 4  // Change these numbers to adjust weight
}
```

### To Change Answer-to-Archetype Mappings

Edit the `mappings` object in the `getArchetypeForAnswer()` function in `src/utils/scoring.ts`:

```typescript
const mappings: Record<string, Record<string, StyleArchetype>> = {
  jewelry: {
    a: 'romantic',  // Change these mappings
    b: 'bold',
    // ...
  }
}
```

### To Change Threshold Percentages

Edit the calculation logic in `calculateQuizResult()` function in `src/utils/scoring.ts`:

```typescript
// Current: secondary needs 30% of primary
const secondary = sortedArchetypes[1] && sortedArchetypes[1][1] > scores[primary] * 0.3
  ? sortedArchetypes[1][0]
  : undefined

// Current: tertiary needs 20% of primary
const tertiary = sortedArchetypes[2] && sortedArchetypes[2][1] > scores[primary] * 0.2
  ? sortedArchetypes[2][0]
  : undefined
```

---

## Testing Scenarios

### Scenario 1: Strong Single Archetype
If user consistently chooses the same archetype across most questions:
- **Result:** Primary only (e.g., "You're mostly Natural.")

### Scenario 2: Mixed Profile
If user chooses 2-3 different archetypes with balanced scores:
- **Result:** Primary + Secondary or Primary + Secondary + Tertiary

### Scenario 3: Visual Override
Since "vibes" has weight 4 (highest), the visual choice can significantly influence the result even if other answers suggest different archetypes.

---

## Quick Reference: Answer Key

For quick lookup, here's every answer mapped to its archetype:

**Jewelry:** A=Romantic, B=Bold, C=Classic, D=Natural, E=Rebellious, F=Creative
**Colors:** A=Rebellious, B=Romantic, C=Classic, D=Bold, E=Natural, F=Creative
**Fabrics:** A=Classic, B=Romantic, C=Romantic, D=Rebellious, E=Bold, F=Creative
**Grooming:** A=Classic, B=Romantic, C=Creative, D=Rebellious, E=Natural, F=Bold
**Outfits:** A=Romantic, B=Rebellious, C=Classic, D=Creative, E=Bold, F=Natural
**Vibes:** A=Rebellious, B=Romantic, C=Bold, D=Classic, E=Creative, F=Natural

---

*Last Updated: 2025-10-11*
