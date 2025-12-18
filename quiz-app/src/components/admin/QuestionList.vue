<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Question } from '../../types'
import { getQuestions, toggleQuestionActive, deleteQuestion as deleteQuestionDB, updateQuestion, subscribeToQuestions } from '../../supabase/database'

const emit = defineEmits<{
  edit: [question: Question]
}>()

const questions = ref<Question[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

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
    await toggleQuestionActive(question.id, !question.isActive)
  } catch (e: any) {
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

      // 順番を入れ替え
      await updateQuestion(current.id, { order: next.order })
      await updateQuestion(next.id, { order: current.order })
    } catch (e: any) {
      alert(`エラー: ${e.message}`)
      console.error('Error moving question:', e)
    }
  }
}
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
        :class="{ inactive: !question.isActive }"
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

          <label class="toggle-switch">
            <input
              type="checkbox"
              :checked="question.isActive"
              @change="toggleActive(question)"
            >
            <span class="slider"></span>
          </label>

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

.question-item.inactive {
  opacity: 0.6;
  background: #f9f9f9;
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

.btn-edit,
.btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
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
</style>
