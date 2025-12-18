<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const emit = defineEmits<{
  start: []
}>()

const dots = ref('...')
let interval: number

onMounted(() => {
  // ローディングアニメーション
  interval = setInterval(() => {
    dots.value = dots.value.length >= 3 ? '.' : dots.value + '.'
  }, 500)

  // TODO: Firebaseのクイズモード状態を監視
  // クイズが開始されたら自動的にemit('start')を呼ぶ
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<template>
  <div class="title-screen">
    <div class="container">
      <div class="logo-area">
        <div class="quiz-icon">📝</div>
        <h1 class="title">クイズ大会</h1>
      </div>

      <div class="waiting-card">
        <div class="status-indicator">
          <div class="pulse-dot"></div>
          <span>待機中</span>
        </div>

        <p class="message">
          クイズの開始をお待ちください{{ dots }}
        </p>

        <div class="instructions">
          <h3>参加方法</h3>
          <ol>
            <li>クイズが開始されるまでお待ちください</li>
            <li>開始されると自動的に問題画面に移動します</li>
            <li>各問題に回答してください</li>
            <li>全問終了後、結果が表示されます</li>
          </ol>
        </div>
      </div>

      <div class="info-text">
        管理者がクイズを開始すると、自動的に開始されます
      </div>
    </div>
  </div>
</template>

<style scoped>
.title-screen {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
}

.container {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
}

.logo-area {
  text-align: center;
  margin-bottom: var(--space-4xl);
}

.quiz-icon {
  font-size: 80px;
  margin-bottom: var(--space-lg);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.title {
  font-size: var(--text-display-sm);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
  background: linear-gradient(135deg, var(--primary-blue), var(--accent-cyan));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.waiting-card {
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-2xl);
  padding: var(--space-3xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-secondary);
  margin-bottom: var(--space-2xl);
}

.status-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  margin-bottom: var(--space-2xl);
  font-size: var(--text-body-lg);
  font-weight: var(--font-semibold);
  color: var(--primary-blue);
}

.pulse-dot {
  width: 12px;
  height: 12px;
  background: var(--primary-blue);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}

.message {
  text-align: center;
  font-size: var(--text-body-lg);
  color: var(--text-secondary);
  margin: 0 0 var(--space-3xl);
  min-height: 30px;
}

.instructions {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
}

.instructions h3 {
  font-size: var(--text-h5);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-lg);
}

.instructions ol {
  margin: 0;
  padding-left: var(--space-xl);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
}

.instructions li {
  margin: var(--space-sm) 0;
  font-size: var(--text-body-sm);
}

.info-text {
  text-align: center;
  font-size: var(--text-body-sm);
  color: var(--text-tertiary);
  padding: 0 var(--space-lg);
}

/* モバイル最適化 */
@media (max-width: 375px) {
  .title {
    font-size: var(--text-display-sm);
  }

  .waiting-card {
    padding: var(--space-2xl);
  }

  .quiz-icon {
    font-size: 60px;
  }
}

/* タッチデバイス最適化 */
@media (hover: none) {
  .waiting-card {
    -webkit-tap-highlight-color: transparent;
  }
}
</style>
