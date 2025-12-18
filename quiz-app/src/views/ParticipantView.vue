<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import TitleScreen from '../components/participant/TitleScreen.vue'
import QuizScreen from '../components/participant/QuizScreen.vue'
import ResultScreen from '../components/participant/ResultScreen.vue'

const route = useRoute()
const userName = computed(() => route.query.user as string || '名無し')
const currentScreen = ref<'title' | 'quiz' | 'result'>('title')

onMounted(() => {
  if (!route.query.user) {
    alert('URLパラメータにユーザー名が指定されていません。\n正しいURL: ?user=あなたの名前')
  }
})

const startQuiz = () => {
  currentScreen.value = 'quiz'
}

const showResult = () => {
  currentScreen.value = 'result'
}
</script>

<template>
  <div class="participant-view">
    <header class="participant-header">
      <div class="user-info">
        <span class="user-label">回答者:</span>
        <span class="user-name">{{ userName }}</span>
      </div>
    </header>

    <main class="participant-content">
      <TitleScreen
        v-if="currentScreen === 'title'"
        @start="startQuiz"
      />
      <QuizScreen
        v-if="currentScreen === 'quiz'"
        :user-name="userName"
        @finish="showResult"
      />
      <ResultScreen
        v-if="currentScreen === 'result'"
        :user-name="userName"
      />
    </main>
  </div>
</template>

<style scoped>
.participant-view {
  min-height: 100vh;
  background: #f5f5f5;
}

.participant-header {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.user-info {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.user-name {
  font-size: 1.2rem;
  font-weight: bold;
}

.participant-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
