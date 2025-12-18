<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import type { Question, QuizMode } from '../../types'
import {
  getQuestions,
  toggleQuestionActive,
  getQuizMode,
  startQuiz as startQuizDB,
  endQuiz as endQuizDB,
  subscribeToQuestions,
  subscribeToQuizMode,
  subscribeToUsers,
  subscribeToResponses
} from '../../supabase/database'
import type { User, Response } from '../../types'

const quizMode = ref<QuizMode>({
  isActive: false,
  startedAt: null,
  endedAt: null
})
const questions = ref<Question[]>([])
const users = ref<User[]>([])
const responses = ref<Response[]>([])
const loading = ref(true)

let unsubscribeQuizMode: (() => void) | null = null
let unsubscribeQuestions: (() => void) | null = null
let unsubscribeUsers: (() => void) | null = null
let unsubscribeResponses: (() => void) | null = null

onMounted(async () => {
  try {
    // 初回データ取得
    quizMode.value = await getQuizMode()
    questions.value = await getQuestions()

    // リアルタイム購読
    unsubscribeQuizMode = subscribeToQuizMode((mode) => {
      quizMode.value = mode
    })

    unsubscribeQuestions = subscribeToQuestions((updatedQuestions) => {
      questions.value = updatedQuestions
    })

    unsubscribeUsers = subscribeToUsers((updatedUsers) => {
      users.value = updatedUsers
    })

    unsubscribeResponses = subscribeToResponses((updatedResponses) => {
      responses.value = updatedResponses
    })
  } catch (e: any) {
    console.error('Error loading data:', e)
    alert(`エラー: ${e.message}`)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  if (unsubscribeQuizMode) unsubscribeQuizMode()
  if (unsubscribeQuestions) unsubscribeQuestions()
  if (unsubscribeUsers) unsubscribeUsers()
  if (unsubscribeResponses) unsubscribeResponses()
})

const activeQuestions = computed(() => {
  return questions.value.filter(q => q.isActive && !q.isDeleted)
})

const activeUsers = computed(() => {
  return users.value.filter(u => !u.isDeleted)
})

const totalResponses = computed(() => {
  return responses.value.length
})

const startQuiz = async () => {
  if (confirm('クイズを開始しますか?')) {
    try {
      await startQuizDB()
    } catch (e: any) {
      console.error('Error starting quiz:', e)
      alert(`エラー: ${e.message}`)
    }
  }
}

const endQuiz = async () => {
  if (confirm('クイズを終了しますか?')) {
    try {
      await endQuizDB()
    } catch (e: any) {
      console.error('Error ending quiz:', e)
      alert(`エラー: ${e.message}`)
    }
  }
}

const toggleQuestion = async (question: Question) => {
  try {
    await toggleQuestionActive(question.id, !question.isActive)
  } catch (e: any) {
    console.error('Error toggling question:', e)
    alert(`エラー: ${e.message}`)
  }
}
</script>

<template>
  <div class="quiz-mode-control">
    <div v-if="loading" class="loading-state">
      <p>読み込み中...</p>
    </div>

    <template v-else>
      <div class="control-header">
        <h2>クイズ進行管理</h2>
        <div class="status-indicator" :class="{ active: quizMode.isActive }">
          {{ quizMode.isActive ? 'クイズ実施中' : 'クイズ待機中' }}
        </div>
      </div>

      <div class="control-section">
        <h3>クイズモード設定</h3>
        <div class="mode-controls">
          <button
            class="btn-start"
            @click="startQuiz"
            :disabled="quizMode.isActive"
          >
            クイズ開始
          </button>
          <button
            class="btn-end"
            @click="endQuiz"
            :disabled="!quizMode.isActive"
          >
            クイズ終了
          </button>
        </div>
        <p class="help-text">
          クイズを開始すると、回答者がタイトル画面から問題画面へアクセスできるようになります。
        </p>
      </div>

      <div class="control-section">
        <h3>問題の公開設定</h3>
        <p class="help-text">
          問題を有効にすると、回答者が閲覧・回答できるようになります。
          クイズの進行に合わせて問題を順番に有効化してください。
        </p>

        <div class="question-toggles">
          <div v-if="questions.filter(q => !q.isDeleted).length === 0" class="empty-state">
            <p>問題管理画面で問題を作成してください</p>
          </div>
          <div v-else class="question-list">
            <div
              v-for="(question, index) in questions.filter(q => !q.isDeleted)"
              :key="question.id"
              class="question-toggle-item"
            >
              <div class="question-info">
                <span class="question-number">Q{{ index + 1 }}</span>
                <span class="question-text">
                  {{ question.text.substring(0, 50) }}{{ question.text.length > 50 ? '...' : '' }}
                </span>
              </div>
              <label class="toggle-switch">
                <input
                  type="checkbox"
                  :checked="question.isActive"
                  @change="toggleQuestion(question)"
                >
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="control-section">
        <h3>リアルタイム状況</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ activeUsers.length }}</div>
            <div class="stat-label">アクティブな回答者</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ activeQuestions.length }}</div>
            <div class="stat-label">公開中の問題</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ totalResponses }}</div>
            <div class="stat-label">総回答数</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.quiz-mode-control {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.loading-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.control-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.control-header h2 {
  margin: 0;
  color: #2c3e50;
}

.status-indicator {
  padding: 0.5rem 1rem;
  background: #e0e0e0;
  color: #666;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.status-indicator.active {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.control-section {
  margin-bottom: 2rem;
}

.control-section h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.mode-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.btn-start,
.btn-end {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-start {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  flex: 1;
}

.btn-start:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

.btn-end {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  color: white;
  flex: 1;
}

.btn-end:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.4);
}

.btn-start:disabled,
.btn-end:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.help-text {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.question-toggles {
  margin-top: 1rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
  color: #999;
}

.question-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.question-toggle-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  transition: all 0.2s;
}

.question-toggle-item:hover {
  border-color: #0ea5e9;
  background: #f0f9ff;
}

.question-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.question-number {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
}

.question-text {
  color: #2c3e50;
  font-size: 0.95rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  flex-shrink: 0;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #4caf50;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.stat-card {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
}
</style>
