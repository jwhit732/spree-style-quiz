export interface QuizAnswer {
  questionId: string
  value: string | string[]
}

export interface QuizState {
  currentStep: number
  answers: Record<string, string | string[]>
  isComplete: boolean
}

export type StyleArchetype = 
  | 'natural' 
  | 'classic' 
  | 'bold' 
  | 'creative' 
  | 'rebellious' 
  | 'romantic'

export interface QuizResult {
  primary: StyleArchetype
  secondary?: StyleArchetype
  tertiary?: StyleArchetype
  scores: Record<StyleArchetype, number>
  description: string
}

export interface QuestionSection {
  id: string
  title: string
  options: QuestionOption[]
}

export interface Question {
  id: string
  title: string
  subtitle?: string
  type: 'single' | 'multiple' | 'image'
  maxSelections?: number
  options: QuestionOption[]
  sections?: QuestionSection[]
}

export interface QuestionOption {
  id: string
  text: string
  archetype: StyleArchetype
  weight?: number
  imageUrl?: string
  imageAlt?: string
}

export interface UserSubmission {
  name: string
  email: string
  result: QuizResult
  timestamp: string
}