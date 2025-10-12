import { Question, StyleArchetype } from '@/types/quiz'

export const questions: Question[] = [
  {
    id: 'jewelry',
    title: "What is your preference for jewellery?",
    type: 'single',
    options: [
      {
        id: 'a',
        text: 'Pretty pieces that are dainty, sparkly, or include diamonds or pearls',
        archetype: 'romantic',
      },
      {
        id: 'b',
        text: 'Chunky earrings or bold statement necklaces and/or bangles',
        archetype: 'bold',
      },
      {
        id: 'c',
        text: 'A quality matching set – necklace, bracelet, earrings in gold or silver',
        archetype: 'classic',
      },
      {
        id: 'd',
        text: 'Minimal – a simple watch, a meaningful ring or chain',
        archetype: 'natural',
      },
      {
        id: 'e',
        text: 'Chunky, metal, unconventional shapes or even a little shock value',
        archetype: 'rebellious',
      },
      {
        id: 'f',
        text: 'Anything unique from my travels, handmade artisan styles or vintage',
        archetype: 'creative',
      },
    ],
  },
  {
    id: 'colors',
    title: 'Which colours do you wear most often?',
    type: 'single',
    options: [
      {
        id: 'a',
        text: 'Mostly black, charcoal, or dark tones',
        archetype: 'rebellious',
      },
      {
        id: 'b',
        text: 'Soft pastels or even something shiny',
        archetype: 'romantic',
      },
      {
        id: 'c',
        text: 'Crisp neutrals like black and white',
        archetype: 'classic',
      },
      {
        id: 'd',
        text: 'Anything that is bright or vibrant — ideally block colour',
        archetype: 'bold',
      },
      {
        id: 'e',
        text: 'Warm, natural colours like olive, rust, or tan',
        archetype: 'natural',
      },
      {
        id: 'f',
        text: 'Colours on the same tonal palette, or expressed in prints and patterns',
        archetype: 'creative',
      },
    ],
  },
  {
    id: 'fabrics',
    title: 'What fabrics do you enjoy wearing?',
    type: 'single',
    options: [
      {
        id: 'a',
        text: 'High-quality wool, silk, or tailored fabric blends',
        archetype: 'classic',
      },
      {
        id: 'b',
        text: 'Lace, velvet, embroidery, or interesting layers',
        archetype: 'romantic',
      },
      {
        id: 'c',
        text: 'Anything that is soft or feels lovely on the skin',
        archetype: 'romantic',
      },
      {
        id: 'd',
        text: 'Distressed, black or heavy materials',
        archetype: 'rebellious',
      },
      {
        id: 'e',
        text: 'Luxe textures like satin, faux leather, polished finishes',
        archetype: 'bold',
      },
      {
        id: 'f',
        text: "I do not have a go-to, but I love mixing textures to create a vibe",
        archetype: 'creative',
      },
    ],
  },
  {
    id: 'grooming',
    title: 'How would you describe your grooming or beauty approach?',
    type: 'single',
    options: [
      {
        id: 'a',
        text: 'Neat and polished',
        archetype: 'classic',
      },
      {
        id: 'b',
        text: 'Soft and feminine',
        archetype: 'romantic',
      },
      {
        id: 'c',
        text: 'Individual and resourceful',
        archetype: 'creative',
      },
      {
        id: 'd',
        text: 'Edgy or unconventional',
        archetype: 'rebellious',
      },
      {
        id: 'e',
        text: 'Effortless and low-maintenance',
        archetype: 'natural',
      },
      {
        id: 'f',
        text: 'Confident and statement-making',
        archetype: 'bold',
      },
    ],
  },
  {
    id: 'personality',
    title: 'Which words feel most like you?',
    subtitle: 'Choose up to 6 words total',
    type: 'multiple',
    maxSelections: 6,
    options: [
      // Column 1: Personality traits
      { id: 'a1', text: 'Organised', archetype: 'classic' },
      { id: 'a2', text: 'Easygoing', archetype: 'natural' },
      { id: 'a3', text: 'Feminine', archetype: 'romantic' },
      { id: 'a4', text: 'Bold', archetype: 'bold' },
      { id: 'a5', text: 'Quirky', archetype: 'creative' },
      { id: 'a6', text: 'Defiant', archetype: 'rebellious' },
      
      // Column 2: How you want to come across
      { id: 'b1', text: 'Daring', archetype: 'bold' },
      { id: 'b2', text: 'Approachable', archetype: 'natural' },
      { id: 'b3', text: 'Powerful', archetype: 'bold' },
      { id: 'b4', text: 'Warm', archetype: 'romantic' },
      { id: 'b5', text: 'Sensible', archetype: 'classic' },
      { id: 'b6', text: 'Innovative', archetype: 'creative' },
      
      // Column 3: What matters most in style
      { id: 'c1', text: 'Breaking the rules', archetype: 'rebellious' },
      { id: 'c2', text: 'Comfort', archetype: 'natural' },
      { id: 'c3', text: 'Neatness', archetype: 'classic' },
      { id: 'c4', text: 'Softness', archetype: 'romantic' },
      { id: 'c5', text: 'Individuality', archetype: 'creative' },
      { id: 'c6', text: 'Making a statement', archetype: 'bold' },
    ],
  },
  {
    id: 'outfits',
    title: 'What kind of outfit makes you feel most yourself?',
    type: 'single',
    options: [
      {
        id: 'a',
        text: 'A soft dress, floaty blouse or knitwear in gentle tones',
        archetype: 'romantic',
      },
      {
        id: 'b',
        text: 'A leather jacket, boots or something with a strong edge',
        archetype: 'rebellious',
      },
      {
        id: 'c',
        text: 'A smart blazer, structured pants and well-made basics',
        archetype: 'classic',
      },
      {
        id: 'd',
        text: 'A mix of eras, layers or prints with personality',
        archetype: 'creative',
      },
      {
        id: 'e',
        text: 'A bold dress or eye-catching combo that makes you feel powerful',
        archetype: 'bold',
      },
      {
        id: 'f',
        text: 'Easy jeans, a comfy tee and relaxed shoes',
        archetype: 'natural',
      },
    ],
  },
  {
    id: 'vibes',
    title: 'Which of these vibes feels most like how you would like to feel and be seen in your style?',
    type: 'image',
    options: [
      {
        id: 'a',
        {/* text: 'Rebellious', */}
        archetype: 'rebellious',
        weight: 4,
        imageUrl: 'https://images.squarespace-cdn.com/content/5c3079f9f407b4ab43249324/52d4e589-1d92-48d6-a8b8-6e0de7423afe/Rebellious+archetype+image.png?content-type=image%2Fpng',
        imageAlt: 'Rebellious style archetype',
      },
      {
        id: 'b',
        {/*text: 'Romantic',*/}
        archetype: 'romantic',
        weight: 4,
        imageUrl: 'https://images.squarespace-cdn.com/content/5c3079f9f407b4ab43249324/470e1ed2-a4f2-47c1-be94-7691a8914cf3/Romatic+image+high+res.png?content-type=image%2Fpng',
        imageAlt: 'Romantic style archetype',
      },
      {
        id: 'c',
        {/*text: 'Bold',*/}
        archetype: 'bold',
        weight: 4,
        imageUrl: 'https://images.squarespace-cdn.com/content/5c3079f9f407b4ab43249324/b7039ca3-d8b1-4c88-a5d1-0fcb8056100c/Bold+Style+Archetype.png?content-type=image%2Fpng',
        imageAlt: 'Bold style archetype',
      },
      {
        id: 'd',
        {/*text: 'Classic',*/}
        archetype: 'classic',
        weight: 4,
        imageUrl: 'https://images.squarespace-cdn.com/content/5c3079f9f407b4ab43249324/b3590782-52f2-4b73-a3ff-412321cbe26e/Classic+Style+Archetype.png?content-type=image%2Fpng',
        imageAlt: 'Classic style archetype',
      },
      {
        id: 'e',
        {/*text: 'Creative',*/}
        archetype: 'creative',
        weight: 4,
        imageUrl: 'https://images.squarespace-cdn.com/content/5c3079f9f407b4ab43249324/d7fa66d8-323d-4b0c-8e9f-25bb9669999c/Creative+style+archetype.png?content-type=image%2Fpng',
        imageAlt: 'Creative style archetype',
      },
      {
        id: 'f',
        {/*text: 'Natural',*/}
        archetype: 'natural',
        weight: 4,
        imageUrl: 'https://images.squarespace-cdn.com/content/5c3079f9f407b4ab43249324/b18349b1-ec33-465a-b988-72eff5490a72/Natural+Style+Archetype.png?content-type=image%2Fpng',
        imageAlt: 'Natural style archetype',
      },
    ],
  },
]