<script setup lang="ts">
import { ref } from 'vue'

const isQuizActive = ref(false)
const activeQuestions = ref<string[]>([])

const startQuiz = () => {
  if (confirm('クイズを開始しますか?')) {
    isQuizActive.value = true
  }
}

const endQuiz = () => {
  if (confirm('クイズを終了しますか?')) {
    isQuizActive.value = false
  }
}

const toggleQuestionActive = (questionId: string) => {
  const index = activeQuestions.value.indexOf(questionId)
  if (index > -1) {
    activeQuestions.value.splice(index, 1)
  } else {
    activeQuestions.value.push(questionId)
  }
}
</script>

<template>
  <div class="quiz-mode-control">
    <div class="control-header">
      <h2>クイズ進行管理</h2>
      <div class="status-indicator" :class="{ active: isQuizActive }">
        {{ isQuizActive ? 'クイズ実施中' : 'クイズ待機中' }}
      </div>
    </div>

    <div class="control-section">
      <h3>クイズモード設定</h3>
      <div class="mode-controls">
        <button
          class="btn-start"
          @click="startQuiz"
          :disabled="isQuizActive"
        >
          クイズ開始
        </button>
        <button
          class="btn-end"
          @click="endQuiz"
          :disabled="!isQuizActive"
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
        <div class="empty-state">
          <p>問題管理画面で問題を作成してください</p>
        </div>
      </div>
    </div>

    <div class="control-section">
      <h3>リアルタイム状況</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">0</div>
          <div class="stat-label">アクティブな回答者</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">0</div>
          <div class="stat-label">公開中の問題</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">0</div>
          <div class="stat-label">総回答数</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quiz-mode-control {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
