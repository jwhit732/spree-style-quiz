import { StyleArchetype, QuizResult } from '@/types/quiz'

export const archetypeDescriptions: Record<StyleArchetype, string> = {
  natural: "You dress with ease and honesty, favoring comfort and authenticity.",
  classic: "Structure, simplicity and timelessness are your anchors in style.",
  bold: "You were made to be seen, thriving on statement pieces and vibrant energy.",
  creative: "You're a style experimenter who finds joy in unexpected combinations.",
  rebellious: "There's a rule-breaking edge to your style that commands attention.",
  romantic: "You love clothes that feel graceful, pretty and soft."
}

export function calculateQuizResult(answers: Record<string, string | string[]>): QuizResult {
  const scores: Record<StyleArchetype, number> = {
    natural: 0,
    classic: 0,
    bold: 0,
    creative: 0,
    rebellious: 0,
    romantic: 0
  }

  // Define scoring weights for each question
  const questionWeights = {
    jewelry: 3,
    colors: 3,
    fabrics: 3,
    grooming: 3,
    personality: 1, // Each selection worth 1 point
    outfits: 3,
    vibes: 4 // Highest weight for the visual choice
  }

  Object.entries(answers).forEach(([questionId, answer]) => {
    if (Array.isArray(answer)) {
      // Handle multiple selections (personality question)
      answer.forEach(selection => {
        const archetype = getArchetypeForAnswer(questionId, selection)
        if (archetype) {
          scores[archetype] += questionWeights.personality
        }
      })
    } else {
      // Handle single selections
      const archetype = getArchetypeForAnswer(questionId, answer)
      if (archetype) {
        const weight = questionWeights[questionId as keyof typeof questionWeights] || 1
        scores[archetype] += weight
      }
    }
  })

  // Sort archetypes by score
  const sortedArchetypes = (Object.entries(scores) as [StyleArchetype, number][])
    .sort(([,a], [,b]) => b - a)
    .filter(([,score]) => score > 0)

  const primary = sortedArchetypes[0][0]
  const secondary = sortedArchetypes[1] && sortedArchetypes[1][1] > scores[primary] * 0.3 
    ? sortedArchetypes[1][0] 
    : undefined
  const tertiary = sortedArchetypes[2] && sortedArchetypes[2][1] > scores[primary] * 0.2
    ? sortedArchetypes[2][0]
    : undefined

  // Generate description
  let description = `You're mostly ${primary.charAt(0).toUpperCase() + primary.slice(1)}`
  if (secondary) {
    description += ` with ${secondary.charAt(0).toUpperCase() + secondary.slice(1)} influences`
  }
  if (tertiary && secondary) {
    description += ` and an element of ${tertiary.charAt(0).toUpperCase() + tertiary.slice(1)}`
  }
  description += '.'

  return {
    primary,
    secondary,
    tertiary,
    scores,
    description
  }
}

function getArchetypeForAnswer(questionId: string, answerId: string): StyleArchetype | null {
  // This is a simplified mapping - in a real implementation, you'd reference the questions data
  const mappings: Record<string, Record<string, StyleArchetype>> = {
    jewelry: {
      a: 'romantic',
      b: 'bold', 
      c: 'classic',
      d: 'natural',
      e: 'rebellious',
      f: 'creative'
    },
    colors: {
      a: 'rebellious',
      b: 'romantic',
      c: 'classic', 
      d: 'bold',
      e: 'natural',
      f: 'creative'
    },
    fabrics: {
      a: 'classic',
      b: 'romantic',
      c: 'romantic',
      d: 'rebellious',
      e: 'bold',
      f: 'creative'
    },
    grooming: {
      a: 'classic',
      b: 'romantic',
      c: 'creative',
      d: 'rebellious', 
      e: 'natural',
      f: 'bold'
    },
    personality: {
      a1: 'classic', a2: 'natural', a3: 'romantic', a4: 'bold', a5: 'creative', a6: 'rebellious',
      b1: 'bold', b2: 'natural', b3: 'bold', b4: 'romantic', b5: 'classic', b6: 'creative',
      c1: 'rebellious', c2: 'natural', c3: 'classic', c4: 'romantic', c5: 'creative', c6: 'bold'
    },
    outfits: {
      a: 'romantic',
      b: 'rebellious', 
      c: 'classic',
      d: 'creative',
      e: 'bold',
      f: 'natural'
    },
    vibes: {
      a: 'rebellious',
      b: 'romantic',
      c: 'bold',
      d: 'classic', 
      e: 'creative',
      f: 'natural'
    }
  }

  return mappings[questionId]?.[answerId] || null
}