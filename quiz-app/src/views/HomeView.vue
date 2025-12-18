<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

onMounted(() => {
  const mode = route.query.mode as string
  const user = route.query.user as string

  if (mode === 'admin') {
    router.push('/admin')
  } else if (user) {
    router.push({ path: '/participant', query: { user } })
  }
})
</script>

<template>
  <main class="home-container">
    <div class="welcome-message">
      <h1>クイズアプリ</h1>
      <p>URLパラメータを確認しています...</p>
      <div class="instructions">
        <h3>アクセス方法:</h3>
        <ul>
          <li>管理者画面: <code>?mode=admin</code></li>
          <li>回答者画面: <code>?user=回答者名</code></li>
        </ul>
      </div>
    </div>
  </main>
</template>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
}

.welcome-message {
  text-align: center;
  max-width: 600px;
}

.welcome-message h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.welcome-message p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.instructions {
  background: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: left;
}

.instructions h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.instructions ul {
  list-style: none;
  padding: 0;
}

.instructions li {
  margin: 0.5rem 0;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
}

.instructions code {
  background: #e8e8e8;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  font-family: monospace;
}
</style>
