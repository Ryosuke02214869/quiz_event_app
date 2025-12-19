<script setup lang="ts">
import { ref } from 'vue'
import QuestionManagement from '../components/admin/QuestionManagement.vue'
import QuizModeControl from '../components/admin/QuizModeControl.vue'
import Dashboard from '../components/admin/Dashboard.vue'
import UserManagement from '../components/admin/UserManagement.vue'

const activeTab = ref<'questions' | 'control' | 'dashboard' | 'users'>('questions')
</script>

<template>
  <div class="admin-view">
    <header class="admin-header">
      <h1>管理画面</h1>
      <p class="subtitle">クイズ出題者用コントロールパネル</p>
    </header>

    <nav class="admin-nav">
      <button
        :class="{ active: activeTab === 'questions' }"
        @click="activeTab = 'questions'"
      >
        問題管理
      </button>
      <button
        :class="{ active: activeTab === 'control' }"
        @click="activeTab = 'control'"
      >
        クイズ進行管理
      </button>
      <button
        :class="{ active: activeTab === 'dashboard' }"
        @click="activeTab = 'dashboard'"
      >
        ダッシュボード
      </button>
      <button
        :class="{ active: activeTab === 'users' }"
        @click="activeTab = 'users'"
      >
        回答者管理
      </button>
    </nav>

    <main class="admin-content">
      <QuestionManagement v-if="activeTab === 'questions'" />
      <QuizModeControl v-if="activeTab === 'control'" />
      <Dashboard v-if="activeTab === 'dashboard'" />
      <UserManagement v-if="activeTab === 'users'" />
    </main>
  </div>
</template>

<style scoped>
.admin-view {
  min-height: 100vh;
  background: #f5f5f5;
}

.admin-header {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  padding: 2rem;
  text-align: center;
}

.admin-header h1 {
  margin: 0;
  font-size: 2rem;
}

.subtitle {
  margin: 0.5rem 0 0;
  opacity: 0.9;
}

.admin-nav {
  display: flex;
  justify-content: center;
  background: white;
  padding: 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  gap: 0;
}

.admin-nav button {
  flex: 1;
  max-width: 200px;
  padding: 1rem 2rem;
  border: none;
  background: white;
  color: #666;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s;
  border-bottom: 3px solid transparent;
}

.admin-nav button:hover {
  background: #f9f9f9;
  color: #0ea5e9;
}

.admin-nav button.active {
  color: #0ea5e9;
  border-bottom-color: #0ea5e9;
  background: #f9f9f9;
}

.admin-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* タブレット対応 (768px以下) */
@media (max-width: 768px) {
  .admin-header {
    padding: 1.5rem 1rem;
  }

  .admin-header h1 {
    font-size: 1.5rem;
  }

  .subtitle {
    font-size: 0.9rem;
  }

  .admin-nav {
    overflow-x: auto;
    justify-content: flex-start;
    -webkit-overflow-scrolling: touch;
  }

  .admin-nav button {
    flex: 0 0 auto;
    min-width: 120px;
    max-width: none;
    padding: 1rem 1.5rem;
    font-size: 0.9rem;
  }

  .admin-content {
    padding: 1rem;
  }
}

/* モバイル対応 (480px以下) */
@media (max-width: 480px) {
  .admin-header {
    padding: 1rem;
  }

  .admin-header h1 {
    font-size: 1.25rem;
  }

  .subtitle {
    font-size: 0.85rem;
  }

  .admin-nav button {
    min-width: 100px;
    padding: 0.875rem 1rem;
    font-size: 0.85rem;
  }

  .admin-content {
    padding: 0.75rem;
  }
}
</style>
