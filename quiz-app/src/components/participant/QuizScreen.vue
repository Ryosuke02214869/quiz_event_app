<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Question, UserResponses } from '../../types'
import {
  getQuestions,
  getUserByName,
  createUser,
  saveResponse,
  getUserResponses,
  subscribeToQuestions
} from '../../supabase/database'

interface Props {
  userName: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  finish: []
}>()

const questions = ref<Question[]>([])
const userResponses = ref<Record<string, { selectedAnswer: number; isCorrect: boolean }>>({})
const loading = ref(true)
const currentQuestionIndex = ref(0)
const selectedAnswer = ref<number | null>(null)
const isAnswered = ref(false)
const showConfirmModal = ref(false)
const showHistoryModal = ref(false)
const userId = ref<string>('')

let unsubscribe: (() => void) | null = null

onMounted(async () => {
  try {
    // ユーザーを取得または作成
    let user = await getUserByName(props.userName)
    if (!user) {
      user = await createUser(props.userName)
    }
    userId.value = user.id

    // 問題を取得（有効な問題のみ）
    const allQuestions = await getQuestions()
    questions.value = allQuestions.filter(q => q.isActive && !q.isDeleted)

    // 既存の回答を取得
    const responses = await getUserResponses(userId.value)
    const responsesMap: Record<string, { selectedAnswer: number; isCorrect: boolean }> = {}
    responses.forEach((resp: any) => {
      responsesMap[resp.question_id] = {
        selectedAnswer: resp.selected_answer,
        isCorrect: resp.is_correct
      }
    })
    userResponses.value = responsesMap

    // リアルタイム購読（問題が追加・変更された場合）
    unsubscribe = subscribeToQuestions(async (updatedQuestions) => {
      questions.value = updatedQuestions.filter(q => q.isActive && !q.isDeleted)
    })

    // 回答済みの問題があれば次の未回答問題に移動
    const firstUnanswered = questions.value.findIndex(q => !userResponses.value[q.id])
    if (firstUnanswered !== -1) {
      currentQuestionIndex.value = firstUnanswered
    }
  } catch (e: any) {
    console.error('Error loading quiz data:', e)
    alert(`エラー: ${e.message}`)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
const totalQuestions = computed(() => questions.value.length)
const progress = computed(() => ((currentQuestionIndex.value + 1) / totalQuestions.value) * 100)

const selectAnswer = (index: number) => {
  if (!isAnswered.value) {
    selectedAnswer.value = index
  }
}

const confirmAnswer = () => {
  if (selectedAnswer.value === null) {
    alert('選択肢を選んでください')
    return
  }
  showConfirmModal.value = true
}

const submitAnswer = async () => {
  if (selectedAnswer.value === null) return

  try {
    const question = currentQuestion.value
    await saveResponse(
      userId.value,
      question.id,
      selectedAnswer.value,
      question.correctAnswer
    )

    // ローカルに回答を保存
    userResponses.value[question.id] = {
      selectedAnswer: selectedAnswer.value,
      isCorrect: selectedAnswer.value === question.correctAnswer
    }

    isAnswered.value = true
    showConfirmModal.value = false
  } catch (e: any) {
    console.error('Error submitting answer:', e)
    alert(`エラー: ${e.message}`)
  }
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < totalQuestions.value - 1) {
    currentQuestionIndex.value++
    selectedAnswer.value = null
    isAnswered.value = false
  } else {
    emit('finish')
  }
}

const toggleHistory = () => {
  showHistoryModal.value = !showHistoryModal.value
}
</script>

<template>
  <div class="quiz-screen">
    <!-- プログレスバー -->
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progress + '%' }"></div>
    </div>

    <!-- 問題ナンバー -->
    <div class="question-header">
      <div class="question-number">
        問題 {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}
      </div>
      <button class="history-button" @click="toggleHistory">
        📋 履歴
      </button>
    </div>

    <!-- 問題カード -->
    <div class="question-card">
      <!-- 問題文 -->
      <div class="question-text">
        {{ currentQuestion.text }}
      </div>

      <!-- 問題画像 -->
      <div v-if="currentQuestion.images.length > 0" class="question-images">
        <img
          v-for="(image, index) in currentQuestion.images"
          :key="index"
          :src="image"
          alt="問題画像"
          class="question-image"
        >
      </div>

      <!-- 選択肢 -->
      <div class="options-container">
        <button
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          class="option-button"
          :class="{
            selected: selectedAnswer === index,
            disabled: isAnswered
          }"
          @click="selectAnswer(index)"
          :disabled="isAnswered"
        >
          <div class="option-content">
            <div class="option-number">{{ String.fromCharCode(65 + index) }}</div>
            <div class="option-text">{{ option.text }}</div>
          </div>
          <div v-if="option.image" class="option-image">
            <img :src="option.image" alt="選択肢画像">
          </div>
        </button>
      </div>

      <!-- アクションボタン -->
      <div class="action-buttons">
        <button
          v-if="!isAnswered"
          class="btn-answer"
          @click="confirmAnswer"
          :disabled="selectedAnswer === null"
        >
          回答する
        </button>

        <div v-else class="answered-state">
          <div class="answered-badge">✓ 回答済み</div>
          <button class="btn-next" @click="nextQuestion">
            {{ currentQuestionIndex < totalQuestions - 1 ? '次へ' : '結果を見る' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 確認モーダル -->
    <div v-if="showConfirmModal" class="modal-overlay" @click="showConfirmModal = false">
      <div class="modal-content" @click.stop>
        <h3>回答を確定しますか？</h3>
        <p class="modal-message">
          選択した回答:
          <strong>{{ String.fromCharCode(65 + (selectedAnswer ?? 0)) }}. {{ currentQuestion.options[selectedAnswer ?? 0].text }}</strong>
        </p>
        <p class="modal-warning">※確定後は変更できません</p>
        <div class="modal-buttons">
          <button class="btn-cancel" @click="showConfirmModal = false">
            キャンセル
          </button>
          <button class="btn-confirm" @click="submitAnswer">
            確定する
          </button>
        </div>
      </div>
    </div>

    <!-- 履歴モーダル -->
    <div v-if="showHistoryModal" class="modal-overlay" @click="showHistoryModal = false">
      <div class="modal-content history-modal" @click.stop>
        <h3>回答履歴</h3>
        <div class="history-empty">
          まだ回答がありません
        </div>
        <button class="btn-close" @click="showHistoryModal = false">
          閉じる
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quiz-screen {
  min-height: calc(100vh - 80px);
  padding: 0;
}

.progress-bar {
  height: 4px;
  background: var(--border-secondary);
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-blue), var(--accent-cyan));
  transition: width var(--transition-slow);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg);
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-secondary);
}

.question-number {
  font-size: var(--text-body-lg);
  font-weight: var(--font-semibold);
  color: var(--primary-blue);
}

.history-button {
  padding: var(--space-sm) var(--space-lg);
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-full);
  font-size: var(--text-body-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  min-height: 44px;
}

.question-card {
  padding: var(--space-2xl) var(--space-lg);
  max-width: 640px;
  margin: 0 auto;
}

.question-text {
  font-size: var(--text-body-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-3xl);
  padding: var(--space-2xl);
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-secondary);
}

.question-images {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  margin-bottom: var(--space-3xl);
}

.question-image {
  width: 100%;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  margin-bottom: var(--space-3xl);
}

.option-button {
  width: 100%;
  padding: var(--space-xl);
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  border: 2px solid var(--border-secondary);
  border-radius: var(--radius-xl);
  text-align: left;
  transition: all var(--transition-fast);
  min-height: 64px;
}

.option-button:active {
  transform: scale(0.98);
}

.option-button.selected {
  border-color: var(--primary-blue);
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(0, 255, 250, 0.1));
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
}

.option-button.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.option-content {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

.option-number {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  background: var(--primary-blue);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-semibold);
  font-size: var(--text-body-sm);
}

.option-button.selected .option-number {
  background: var(--accent-cyan);
}

.option-text {
  flex: 1;
  font-size: var(--text-body);
  color: var(--text-primary);
  line-height: var(--leading-snug);
}

.option-image {
  margin-top: var(--space-md);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.option-image img {
  width: 100%;
  display: block;
}

.action-buttons {
  position: sticky;
  bottom: 0;
  padding: var(--space-lg);
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  border-top: 1px solid var(--border-secondary);
  margin: 0 calc(-1 * var(--space-lg));
}

.btn-answer,
.btn-next {
  width: 100%;
  padding: var(--space-xl);
  background: linear-gradient(135deg, var(--primary-blue), var(--dark-blue));
  color: white;
  border: none;
  border-radius: var(--radius-xl);
  font-size: var(--text-body-lg);
  font-weight: var(--font-semibold);
  min-height: 56px;
  box-shadow: var(--shadow-md);
}

.btn-answer:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-answer:active:not(:disabled),
.btn-next:active {
  transform: scale(0.98);
}

.answered-state {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.answered-badge {
  text-align: center;
  padding: var(--space-md);
  background: var(--success-bg);
  color: var(--success-text);
  border-radius: var(--radius-md);
  font-weight: var(--font-semibold);
}

/* モーダル */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: var(--bg-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-lg);
  animation: fadeIn var(--transition-fast);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-2xl);
  padding: var(--space-3xl);
  max-width: 400px;
  width: 100%;
  box-shadow: var(--shadow-xl);
  animation: slideUp var(--transition-base);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-content h3 {
  margin: 0 0 var(--space-lg);
  font-size: var(--text-h4);
  color: var(--text-primary);
}

.modal-message {
  margin: 0 0 var(--space-sm);
  color: var(--text-secondary);
  line-height: var(--leading-normal);
}

.modal-warning {
  margin: 0 0 var(--space-2xl);
  font-size: var(--text-body-sm);
  color: var(--warning-text);
}

.modal-buttons {
  display: flex;
  gap: var(--space-md);
}

.btn-cancel,
.btn-confirm,
.btn-close {
  flex: 1;
  padding: var(--space-lg);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--text-body);
  font-weight: var(--font-semibold);
  min-height: 48px;
}

.btn-cancel {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.btn-confirm {
  background: linear-gradient(135deg, var(--primary-blue), var(--dark-blue));
  color: white;
}

.btn-close {
  width: 100%;
  background: var(--primary-blue);
  color: white;
  margin-top: var(--space-lg);
}

.history-modal {
  max-width: 480px;
  max-height: 80vh;
  overflow-y: auto;
}

.history-empty {
  text-align: center;
  padding: var(--space-4xl);
  color: var(--text-tertiary);
}

/* モバイル最適化 */
@media (max-width: 375px) {
  .question-text {
    font-size: var(--text-body-lg);
    padding: var(--space-lg);
  }

  .option-button {
    padding: var(--space-lg);
  }
}
</style>
