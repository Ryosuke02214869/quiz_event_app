// Question data structure
export interface Question {
  id: string
  order: number
  text: string
  images: string[]
  options: QuestionOption[]
  correctAnswer: number
  showCorrectAnswer: boolean
  isActive: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface QuestionOption {
  text: string
  image: string | null
}

// Quiz mode state
export interface QuizMode {
  isActive: boolean
  startedAt: string | null
  endedAt: string | null
}

// User data structure
export interface User {
  id: string
  name: string
  isDeleted: boolean
  createdAt: string
}

// Response data structure
export interface Response {
  selectedAnswer: number
  isCorrect: boolean
  answeredAt: string
}

export interface UserResponses {
  [questionId: string]: Response
}

// Dashboard statistics
export interface UserStats {
  userId: string
  userName: string
  correctCount: number
  totalAnswered: number
  accuracy: number
  lastAnsweredAt: string | null
}
