<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import type { Question } from '../../types'
import { getQuestions, toggleQuestionActive, deleteQuestion as deleteQuestionDB, updateQuestion, subscribeToQuestions } from '../../supabase/database'

const emit = defineEmits<{
  edit: [question: Question]
}>()

const questions = ref<Question[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const showPreviewModal = ref(false)
const previewQuestion = ref<Question | null>(null)

let unsubscribe: (() => void) | null = null

onMounted(async () => {
  try {
    // 初回データ取得
    questions.value = await getQuestions()

    // リアルタイム購読
    unsubscribe = subscribeToQuestions((updatedQuestions) => {
      questions.value = updatedQuestions
    })
  } catch (e: any) {
    error.value = e.message
    console.error('Error loading questions:', e)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})

const toggleActive = async (question: Question) => {
  try {
    // 即座にローカルの状態を更新
    const questionIndex = questions.value.findIndex(q => q.id === question.id)
    if (questionIndex !== -1) {
      const targetQuestion = questions.value[questionIndex]
      if (targetQuestion) {
        targetQuestion.isActive = !targetQuestion.isActive
      }
    }

    // データベースを更新
    await toggleQuestionActive(question.id, !question.isActive)
  } catch (e: any) {
    // エラーが発生した場合、状態を元に戻す
    const questionIndex = questions.value.findIndex(q => q.id === question.id)
    if (questionIndex !== -1) {
      const targetQuestion = questions.value[questionIndex]
      if (targetQuestion) {
        targetQuestion.isActive = !targetQuestion.isActive
      }
    }
    alert(`エラー: ${e.message}`)
    console.error('Error toggling question:', e)
  }
}

const deleteQuestion = async (question: Question) => {
  if (confirm('この問題を削除してもよろしいですか?')) {
    try {
      await deleteQuestionDB(question.id)
    } catch (e: any) {
      alert(`エラー: ${e.message}`)
      console.error('Error deleting question:', e)
    }
  }
}

const moveUp = async (index: number) => {
  if (index > 0) {
    try {
      const current = questions.value[index]
      const previous = questions.value[index - 1]
      if (!current || !previous) return

      // 順番を入れ替え
      await updateQuestion(current.id, { order: previous.order })
      await updateQuestion(previous.id, { order: current.order })
    } catch (e: any) {
      alert(`エラー: ${e.message}`)
      console.error('Error moving question:', e)
    }
  }
}

const moveDown = async (index: number) => {
  if (index < questions.value.length - 1) {
    try {
      const current = questions.value[index]
      const next = questions.value[index + 1]
      if (!current || !next) return

      // 順番を入れ替え
      await updateQuestion(current.id, { order: next.order })
      await updateQuestion(next.id, { order: current.order })
    } catch (e: any) {
      alert(`エラー: ${e.message}`)
      console.error('Error moving question:', e)
    }
  }
}

const openPreview = (question: Question) => {
  previewQuestion.value = question
  showPreviewModal.value = true
}

const closePreview = () => {
  showPreviewModal.value = false
  previewQuestion.value = null
}

// モーダル表示時に背景のスクロールを無効化
watch(showPreviewModal, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <div class="question-list">
    <div v-if="loading" class="loading-state">
      <p>読み込み中...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>エラーが発生しました: {{ error }}</p>
    </div>

    <div v-else-if="questions.length === 0" class="empty-state">
      <p>まだ問題が作成されていません</p>
      <p class="help-text">「新規作成」ボタンから問題を作成してください</p>
    </div>

    <div v-else class="list-container">
      <div
        v-for="(question, index) in questions.filter(q => !q.isDeleted)"
        :key="question.id"
        class="question-item"
      >
        <div class="question-number">
          {{ index + 1 }}
        </div>

        <div class="question-content">
          <div class="question-text">
            {{ question.text.substring(0, 100) }}{{ question.text.length > 100 ? '...' : '' }}
          </div>
          <div class="question-meta">
            <span class="badge" :class="{ active: question.isActive }">
              {{ question.isActive ? '有効' : '無効' }}
            </span>
            <span class="badge">
              {{ question.showCorrectAnswer ? '正誤表示あり' : '正誤表示なし' }}
            </span>
            <span class="options-count">
              選択肢: {{ question.options.length }}個
            </span>
          </div>
        </div>

        <div class="question-actions">
          <div class="order-buttons">
            <button
              type="button"
              class="btn-icon"
              @click="moveUp(index)"
              :disabled="index === 0"
            >
              ↑
            </button>
            <button
              type="button"
              class="btn-icon"
              @click="moveDown(index)"
              :disabled="index === questions.filter(q => !q.isDeleted).length - 1"
            >
              ↓
            </button>
          </div>

          <div class="toggle-container">
            <label class="toggle-label">有効/無効</label>
            <label class="toggle-switch">
              <input
                type="checkbox"
                :checked="question.isActive"
                @change="toggleActive(question)"
              >
              <span class="slider"></span>
            </label>
          </div>

          <button
            type="button"
            class="btn-preview"
            @click="openPreview(question)"
          >
            プレビュー
          </button>

          <button
            type="button"
            class="btn-edit"
            @click="emit('edit', question)"
          >
            編集
          </button>

          <button
            type="button"
            class="btn-delete"
            @click="deleteQuestion(question)"
          >
            削除
          </button>
        </div>
      </div>
    </div>

    <!-- プレビューモーダル -->
    <div v-if="showPreviewModal && previewQuestion" class="modal-overlay" @click="closePreview">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>問題プレビュー（スマホ表示）</h3>
          <button class="btn-close-modal" @click="closePreview">✕</button>
        </div>

        <!-- スマホ風コンテナ -->
        <div class="phone-container">
          <div class="phone-screen">
            <div class="preview-container">
              <!-- 問題文 -->
              <div class="preview-question-text">
                {{ previewQuestion.text }}
              </div>

              <!-- 問題画像 -->
              <div v-if="previewQuestion.images.length > 0" class="preview-images">
                <img
                  v-for="(image, index) in previewQuestion.images"
                  :key="index"
                  :src="image"
                  alt="問題画像"
                  class="preview-image"
                >
              </div>

              <!-- 選択肢（2x2グリッド） -->
              <div class="preview-options">
                <div
                  v-for="(option, index) in previewQuestion.options"
                  :key="index"
                  class="preview-option"
                  :class="{ correct: index === previewQuestion.correctAnswer }"
                >
                  <div class="preview-option-content">
                    <div class="preview-option-number">{{ String.fromCharCode(65 + index) }}</div>
                    <div class="preview-option-text">{{ option.text }}</div>
                  </div>
                  <div v-if="option.image" class="preview-option-image">
                    <img :src="option.image" alt="選択肢画像">
                  </div>
                  <div v-if="index === previewQuestion.correctAnswer" class="correct-badge">
                    ✓ 正解
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.question-list {
  margin-top: 2rem;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 3rem;
}

.loading-state {
  color: var(--text-secondary);
}

.error-state {
  color: var(--error-text);
  background: var(--error-bg);
  border-radius: var(--radius-lg);
}

.empty-state {
  color: #999;
}

.empty-state p {
  margin: 0.5rem 0;
}

.help-text {
  font-size: 0.9rem;
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.question-item {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s;
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
  font-size: 1.1rem;
}

.question-content {
  flex: 1;
  min-width: 0;
}

.question-text {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.question-meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #e0e0e0;
  color: #666;
  border-radius: 12px;
  font-size: 0.85rem;
}

.badge.active {
  background: #4caf50;
  color: white;
}

.options-count {
  font-size: 0.85rem;
  color: #999;
}

.question-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.order-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.btn-icon {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-icon:hover:not(:disabled) {
  background: #f0f0f0;
  border-color: #0ea5e9;
}

.btn-icon:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.toggle-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.toggle-label {
  font-size: 0.75rem;
  color: #666;
  white-space: nowrap;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
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

.btn-preview,
.btn-edit,
.btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-preview {
  background: #14b8a6;
  color: white;
}

.btn-preview:hover {
  background: #0d9488;
}

.btn-edit {
  background: #0ea5e9;
  color: white;
}

.btn-edit:hover {
  background: #5568d3;
}

.btn-delete {
  background: #f44336;
  color: white;
}

.btn-delete:hover {
  background: #d32f2f;
}

/* モーダル */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.2s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s;
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

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 2px solid #e0e0e0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #2c3e50;
}

.btn-close-modal {
  width: 32px;
  height: 32px;
  border: none;
  background: #f0f0f0;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  color: #666;
  transition: all 0.2s;
}

.btn-close-modal:hover {
  background: #e0e0e0;
  color: #333;
}

/* スマホ風コンテナ */
.phone-container {
  display: flex;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.phone-screen {
  width: 100%;
  max-width: 375px;
  background: white;
  border-radius: 30px;
  box-shadow:
    0 0 0 8px #1a1a1a,
    0 0 0 10px #2a2a2a,
    0 20px 60px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  max-height: 70vh;
  overflow-y: auto;
}

.preview-container {
  padding: 1.5rem;
}

.preview-question-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.6;
  margin-bottom: 1.25rem;
  padding: 1.25rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #0ea5e9;
}

.preview-images {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.preview-image {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.preview-option {
  padding: 1rem;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.2s;
  position: relative;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.preview-option.correct {
  border-color: #4caf50;
  background: #f1f8f4;
}

.preview-option-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.preview-option-number {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  background: #0ea5e9;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.85rem;
}

.preview-option.correct .preview-option-number {
  background: #4caf50;
}

.preview-option-text {
  flex: 1;
  font-size: 0.9rem;
  color: #2c3e50;
  line-height: 1.4;
  word-break: break-word;
}

.preview-option-image {
  margin-top: 1rem;
  border-radius: 8px;
  overflow: hidden;
}

.preview-option-image img {
  width: 100%;
  display: block;
}

.correct-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.2rem 0.5rem;
  background: #4caf50;
  color: white;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
}
</style>
