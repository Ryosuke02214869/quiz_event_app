import { supabase } from './config'
import type { Question, QuizMode, User, Response } from '../types'

// Questions CRUD
export const createQuestion = async (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => {
  const { data, error } = await supabase
    .from('questions')
    .insert({
      order_num: question.order,
      text: question.text,
      images: question.images,
      options: question.options,
      correct_answer: question.correctAnswer,
      show_correct_answer: question.showCorrectAnswer,
      is_active: question.isActive,
      is_deleted: false
    })
    .select()
    .single()

  if (error) throw error
  return convertQuestionFromDB(data)
}

export const getQuestions = async (): Promise<Question[]> => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('is_deleted', false)
    .order('order_num', { ascending: true })

  if (error) throw error
  return (data || []).map(convertQuestionFromDB)
}

export const getQuestionById = async (id: string): Promise<Question | null> => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw error
  }
  return convertQuestionFromDB(data)
}

export const updateQuestion = async (id: string, updates: Partial<Question>) => {
  const dbUpdates: any = {
    updated_at: new Date().toISOString()
  }

  if (updates.order !== undefined) dbUpdates.order_num = updates.order
  if (updates.text !== undefined) dbUpdates.text = updates.text
  if (updates.images !== undefined) dbUpdates.images = updates.images
  if (updates.options !== undefined) dbUpdates.options = updates.options
  if (updates.correctAnswer !== undefined) dbUpdates.correct_answer = updates.correctAnswer
  if (updates.showCorrectAnswer !== undefined) dbUpdates.show_correct_answer = updates.showCorrectAnswer
  if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive
  if (updates.isDeleted !== undefined) dbUpdates.is_deleted = updates.isDeleted

  const { data, error } = await supabase
    .from('questions')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return convertQuestionFromDB(data)
}

export const deleteQuestion = async (id: string) => {
  return updateQuestion(id, { isDeleted: true })
}

export const toggleQuestionActive = async (id: string, isActive: boolean) => {
  return updateQuestion(id, { isActive })
}

// Quiz Mode
export const getQuizMode = async (): Promise<QuizMode> => {
  const { data, error } = await supabase
    .from('quiz_mode')
    .select('*')
    .eq('id', 1)
    .single()

  if (error) {
    // レコードがない場合は初期化
    if (error.code === 'PGRST116') {
      await supabase.from('quiz_mode').insert({
        id: 1,
        is_active: false,
        started_at: null,
        ended_at: null
      })
      return {
        isActive: false,
        startedAt: null,
        endedAt: null
      }
    }
    throw error
  }

  return {
    isActive: data.is_active,
    startedAt: data.started_at,
    endedAt: data.ended_at
  }
}

export const setQuizMode = async (mode: QuizMode) => {
  const { error } = await supabase
    .from('quiz_mode')
    .upsert({
      id: 1,
      is_active: mode.isActive,
      started_at: mode.startedAt,
      ended_at: mode.endedAt,
      updated_at: new Date().toISOString()
    })

  if (error) throw error
}

export const startQuiz = async () => {
  await setQuizMode({
    isActive: true,
    startedAt: new Date().toISOString(),
    endedAt: null
  })
}

export const endQuiz = async () => {
  const currentMode = await getQuizMode()
  await setQuizMode({
    ...currentMode,
    isActive: false,
    endedAt: new Date().toISOString()
  })
}

// Users
export const createUser = async (name: string): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .insert({
      name,
      is_deleted: false
    })
    .select()
    .single()

  if (error) throw error
  return convertUserFromDB(data)
}

export const getUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('is_deleted', false)
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data || []).map(convertUserFromDB)
}

export const getUserByName = async (name: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('name', name)
    .eq('is_deleted', false)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return convertUserFromDB(data)
}

export const deleteUser = async (id: string) => {
  const { error } = await supabase
    .from('users')
    .update({ is_deleted: true })
    .eq('id', id)

  if (error) throw error
}

// Responses
export const saveResponse = async (
  userId: string,
  questionId: string,
  selectedAnswer: number,
  correctAnswer: number
) => {
  const { error } = await supabase
    .from('responses')
    .upsert({
      user_id: userId,
      question_id: questionId,
      selected_answer: selectedAnswer,
      is_correct: selectedAnswer === correctAnswer,
      answered_at: new Date().toISOString()
    })

  if (error) throw error
}

export const getUserResponses = async (userId: string): Promise<Response[]> => {
  const { data, error } = await supabase
    .from('responses')
    .select('*')
    .eq('user_id', userId)
    .order('answered_at', { ascending: true })

  if (error) throw error
  return (data || []).map(convertResponseFromDB)
}

export const getAllResponses = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('responses')
    .select('*')
    .order('answered_at', { ascending: true })

  if (error) throw error
  return data || []
}

// Dashboard用のユーザー統計取得
export const getUserStats = async () => {
  const { data: responsesData, error: responsesError } = await supabase
    .from('responses')
    .select('user_id, is_correct, answered_at')

  if (responsesError) throw responsesError

  const { data: usersData, error: usersError } = await supabase
    .from('users')
    .select('id, name')
    .eq('is_deleted', false)

  if (usersError) throw usersError

  // ユーザーごとに統計を計算
  const userStatsMap = new Map()

  for (const user of usersData || []) {
    const userResponses = (responsesData || []).filter(r => r.user_id === user.id)
    const correctCount = userResponses.filter(r => r.is_correct).length
    const totalAnswered = userResponses.length
    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0
    const lastResponse = userResponses.length > 0
      ? userResponses.reduce((latest, current) =>
          new Date(current.answered_at) > new Date(latest.answered_at) ? current : latest
        )
      : null

    userStatsMap.set(user.id, {
      userId: user.id,
      userName: user.name,
      correctCount,
      totalAnswered,
      accuracy,
      lastAnsweredAt: lastResponse ? lastResponse.answered_at : null
    })
  }

  return Array.from(userStatsMap.values())
}

// Real-time subscriptions
export const subscribeToQuestions = (callback: (questions: Question[]) => void) => {
  const channel = supabase
    .channel('questions-channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'questions'
      },
      async () => {
        const questions = await getQuestions()
        callback(questions)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

export const subscribeToQuizMode = (callback: (mode: QuizMode) => void) => {
  const channel = supabase
    .channel('quiz-mode-channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'quiz_mode'
      },
      async () => {
        const mode = await getQuizMode()
        callback(mode)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

export const subscribeToUsers = (callback: (users: User[]) => void) => {
  const channel = supabase
    .channel('users-channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'users'
      },
      async () => {
        const users = await getUsers()
        callback(users)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

export const subscribeToResponses = (callback: (responses: Response[]) => void) => {
  const channel = supabase
    .channel('responses-channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'responses'
      },
      async () => {
        const responses = await getAllResponses()
        callback(responses)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

// Helper functions to convert DB format to app format
function convertQuestionFromDB(data: any): Question {
  return {
    id: data.id,
    order: data.order_num,
    text: data.text,
    images: data.images || [],
    options: data.options,
    correctAnswer: data.correct_answer,
    showCorrectAnswer: data.show_correct_answer,
    isActive: data.is_active,
    isDeleted: data.is_deleted,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  }
}

function convertUserFromDB(data: any): User {
  return {
    id: data.id,
    name: data.name,
    isDeleted: data.is_deleted,
    createdAt: data.created_at
  }
}

function convertResponseFromDB(data: any): Response {
  return {
    selectedAnswer: data.selected_answer,
    isCorrect: data.is_correct,
    answeredAt: data.answered_at
  }
}
