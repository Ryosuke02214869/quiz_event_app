<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  getUserByName,
  getQuestions,
  getUserResponses
} from '../../supabase/database'

interface Props {
  userName: string
}

const props = defineProps<Props>()

const loading = ref(true)
const results = ref({
  correctCount: 0,
  totalQuestions: 0,
  answers: [] as Array<{
    questionId: string
    questionText: string
    selectedAnswer: number
    correctAnswer: number
    isCorrect: boolean
    selectedOptionText: string
    correctOptionText: string
  }>
})

onMounted(async () => {
  try {
    // ユーザーを取得
    const user = await getUserByName(props.userName)
    if (!user) {
      alert('ユーザーが見つかりません')
      return
    }

    // 問題と回答を取得
    const allQuestions = await getQuestions()
    const activeQuestions = allQuestions.filter(q => q.isActive && !q.isDeleted)
    const responses = await getUserResponses(user.id)

    // 回答結果を構築
    const answers = []
    let correctCount = 0

    for (const question of activeQuestions) {
      const response = responses.find((r: any) => r.question_id === question.id)
      if (response) {
        const isCorrect = response.is_correct
        if (isCorrect) correctCount++

        answers.push({
          questionId: question.id,
          questionText: question.text,
          selectedAnswer: response.selected_answer,
          correctAnswer: question.correctAnswer,
          isCorrect,
          selectedOptionText: question.options[response.selected_answer]?.text || '',
          correctOptionText: question.options[question.correctAnswer]?.text || ''
        })
      }
    }

    results.value = {
      correctCount,
      totalQuestions: activeQuestions.length,
      answers
    }
  } catch (e: any) {
    console.error('Error loading results:', e)
    alert(`エラー: ${e.message}`)
  } finally {
    loading.value = false
  }
})

const accuracy = computed(() => {
  if (results.value.totalQuestions === 0) return 0
  return Math.round((results.value.correctCount / results.value.totalQuestions) * 100)
})

const getMessage = computed(() => {
  const acc = accuracy.value
  if (acc === 100) return '完璧です！🎉'
  if (acc >= 80) return '素晴らしい！🌟'
  if (acc >= 60) return 'よくできました！👏'
  if (acc >= 40) return 'もう少し！💪'
  return '次回頑張りましょう！📚'
})

const getAccuracyColor = computed(() => {
  const acc = accuracy.value
  if (acc >= 80) return 'var(--success-text)'
  if (acc >= 60) return 'var(--primary-blue)'
  if (acc >= 40) return 'var(--warning-text)'
  return 'var(--error-text)'
})
</script>

<template>
  <div class="result-screen">
    <div class="container">
      <!-- ヘッダー -->
      <div class="result-header">
        <div class="completion-icon">🏁</div>
        <h1 class="title">お疲れ様でした！</h1>
        <p class="subtitle">{{ userName }}さんの結果</p>
      </div>

      <!-- スコアカード -->
      <div class="score-card">
        <div class="score-circle">
          <svg class="progress-ring" width="200" height="200">
            <circle
              class="progress-ring-bg"
              stroke="var(--border-secondary)"
              stroke-width="12"
              fill="transparent"
              r="90"
              cx="100"
              cy="100"
            />
            <circle
              class="progress-ring-fill"
              :stroke="getAccuracyColor"
              stroke-width="12"
              fill="transparent"
              r="90"
              cx="100"
              cy="100"
              :style="{
                strokeDasharray: `${2 * Math.PI * 90}`,
                strokeDashoffset: `${2 * Math.PI * 90 * (1 - accuracy / 100)}`
              }"
            />
          </svg>
          <div class="score-text">
            <div class="percentage" :style="{ color: getAccuracyColor }">
              {{ accuracy }}%
            </div>
            <div class="score-label">正答率</div>
          </div>
        </div>

        <div class="score-message">{{ getMessage }}</div>

        <div class="score-details">
          <div class="detail-item">
            <div class="detail-label">正解数</div>
            <div class="detail-value correct">
              {{ results.correctCount }} / {{ results.totalQuestions }}
            </div>
          </div>
          <div class="detail-divider"></div>
          <div class="detail-item">
            <div class="detail-label">不正解数</div>
            <div class="detail-value incorrect">
              {{ results.totalQuestions - results.correctCount }}
            </div>
          </div>
        </div>
      </div>

      <!-- 回答一覧 -->
      <div class="answers-section">
        <h2 class="section-title">回答結果</h2>

        <div class="answers-list">
          <div
            v-for="(answer, index) in results.answers"
            :key="answer.questionId"
            class="answer-item"
            :class="{ correct: answer.isCorrect, incorrect: !answer.isCorrect }"
          >
            <div class="answer-header">
              <div class="question-number">問題 {{ index + 1 }}</div>
              <div class="answer-badge" :class="{ correct: answer.isCorrect }">
                {{ answer.isCorrect ? '○ 正解' : '× 不正解' }}
              </div>
            </div>

            <div class="question-text">
              {{ answer.questionText }}
            </div>

            <div class="answer-details">
              <div class="answer-row">
                <span class="label">あなたの回答:</span>
                <span class="value" :class="{ correct: answer.isCorrect, incorrect: !answer.isCorrect }">
                  {{ String.fromCharCode(65 + answer.selectedAnswer) }}. {{ answer.selectedOptionText }}
                </span>
              </div>
              <div v-if="!answer.isCorrect" class="answer-row">
                <span class="label">正解:</span>
                <span class="value correct">
                  {{ String.fromCharCode(65 + answer.correctAnswer) }}. {{ answer.correctOptionText }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ランキング（オプション） -->
      <div class="ranking-section">
        <h2 class="section-title">ランキング</h2>
        <div class="ranking-card">
          <p class="ranking-message">
            ランキングは管理者画面で確認できます
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-screen {
  min-height: calc(100vh - 80px);
  padding: var(--space-2xl) var(--space-lg);
  overflow-y: auto;
}

.container {
  max-width: 640px;
  margin: 0 auto;
}

.result-header {
  text-align: center;
  margin-bottom: var(--space-4xl);
}

.completion-icon {
  font-size: 80px;
  margin-bottom: var(--space-lg);
  animation: bounce 1s ease-in-out;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.title {
  font-size: var(--text-display-sm);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0 0 var(--space-md);
}

.subtitle {
  font-size: var(--text-body-lg);
  color: var(--text-secondary);
  margin: 0;
}

.score-card {
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-2xl);
  padding: var(--space-4xl) var(--space-2xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-secondary);
  margin-bottom: var(--space-3xl);
  text-align: center;
}

.score-circle {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto var(--space-2xl);
}

.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring-fill {
  transition: stroke-dashoffset 1s ease-in-out;
}

.score-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.percentage {
  font-size: 48px;
  font-weight: var(--font-bold);
  line-height: 1;
  margin-bottom: var(--space-xs);
}

.score-label {
  font-size: var(--text-body-sm);
  color: var(--text-secondary);
  font-weight: var(--font-medium);
}

.score-message {
  font-size: var(--text-h4);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-3xl);
}

.score-details {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2xl);
  padding: var(--space-2xl);
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
}

.detail-item {
  text-align: center;
}

.detail-label {
  font-size: var(--text-body-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-xs);
}

.detail-value {
  font-size: var(--text-h3);
  font-weight: var(--font-bold);
}

.detail-value.correct {
  color: var(--success-text);
}

.detail-value.incorrect {
  color: var(--error-text);
}

.detail-divider {
  width: 1px;
  height: 40px;
  background: var(--border-primary);
}

.answers-section,
.ranking-section {
  margin-bottom: var(--space-3xl);
}

.section-title {
  font-size: var(--text-h3);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-xl);
}

.answers-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.answer-item {
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  box-shadow: var(--shadow-sm);
  border: 2px solid var(--border-secondary);
  transition: all var(--transition-base);
}

.answer-item.correct {
  border-color: var(--success-border);
  background: linear-gradient(135deg, var(--bg-card), var(--success-bg));
}

.answer-item.incorrect {
  border-color: var(--error-border);
  background: linear-gradient(135deg, var(--bg-card), var(--error-bg));
}

.answer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.question-number {
  font-size: var(--text-body-sm);
  font-weight: var(--font-semibold);
  color: var(--text-secondary);
}

.answer-badge {
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--text-body-xs);
  font-weight: var(--font-bold);
}

.answer-badge.correct {
  background: var(--success-bg);
  color: var(--success-text);
}

.answer-badge:not(.correct) {
  background: var(--error-bg);
  color: var(--error-text);
}

.question-text {
  font-size: var(--text-body);
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
  line-height: var(--leading-normal);
}

.answer-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding-top: var(--space-md);
  border-top: 1px solid var(--border-secondary);
}

.answer-row {
  display: flex;
  gap: var(--space-sm);
  font-size: var(--text-body-sm);
}

.answer-row .label {
  color: var(--text-secondary);
  font-weight: var(--font-medium);
  min-width: 100px;
}

.answer-row .value {
  color: var(--text-primary);
  font-weight: var(--font-semibold);
  flex: 1;
}

.answer-row .value.correct {
  color: var(--success-text);
}

.answer-row .value.incorrect {
  color: var(--error-text);
}

.ranking-card {
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-xl);
  padding: var(--space-4xl) var(--space-2xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-secondary);
  text-align: center;
}

.ranking-message {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--text-body);
}

/* モバイル最適化 */
@media (max-width: 375px) {
  .result-screen {
    padding: var(--space-xl) var(--space-md);
  }

  .completion-icon {
    font-size: 60px;
  }

  .title {
    font-size: var(--text-h2);
  }

  .score-card {
    padding: var(--space-3xl) var(--space-lg);
  }

  .score-circle {
    width: 160px;
    height: 160px;
  }

  .percentage {
    font-size: 36px;
  }

  .score-details {
    gap: var(--space-lg);
  }
}
</style>
