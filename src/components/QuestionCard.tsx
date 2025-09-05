'use client'

import { motion } from 'framer-motion'
import { QuestionOption } from '@/types/quiz'
import Image from 'next/image'
import { CheckCircle } from 'lucide-react'

interface QuestionCardProps {
  option: QuestionOption
  isSelected: boolean
  onSelect: (optionId: string) => void
  type: 'single' | 'multiple' | 'image'
  disabled?: boolean
}

export default function QuestionCard({ 
  option, 
  isSelected, 
  onSelect, 
  type,
  disabled = false 
}: QuestionCardProps) {
  
  const handleClick = () => {
    if (!disabled) {
      onSelect(option.id)
    }
  }

  if (type === 'image') {
    return (
      <motion.div
        className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 ${
          isSelected 
            ? 'ring-4 ring-accent-500 shadow-xl scale-105' 
            : 'hover:shadow-lg hover:scale-102'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        onClick={handleClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {option.imageUrl && (
          <div className="aspect-square relative">
            <Image
              src={option.imageUrl}
              alt={option.imageAlt || option.text}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            {isSelected && (
              <motion.div 
                className="absolute inset-0 bg-accent-500/20 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <CheckCircle className="w-12 h-12 text-white drop-shadow-lg" />
              </motion.div>
            )}
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <p className="text-white font-medium text-center">{option.text}</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`quiz-card ${isSelected ? 'selected' : ''} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      whileHover={!disabled ? { scale: 1.015 } : {}}
      whileTap={!disabled ? { scale: 0.985 } : {}}
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 mt-1 w-5 h-5 rounded-full border-2 transition-all duration-200 ${
          isSelected 
            ? 'bg-accent-500 border-accent-500' 
            : 'border-primary-300 hover:border-primary-400'
        }`}>
          {isSelected && (
            <motion.div
              className="w-full h-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <CheckCircle className="w-3 h-3 text-white" />
            </motion.div>
          )}
        </div>
        <div className="flex-1">
          <p className="text-primary-900 font-medium leading-relaxed">
            {option.text}
          </p>
        </div>
      </div>
    </motion.div>
  )
}