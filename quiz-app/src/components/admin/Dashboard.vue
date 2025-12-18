<script setup lang="ts">
import { ref, computed } from 'vue'
import type { UserStats } from '../../types'

const users = ref<UserStats[]>([])
const sortBy = ref<'correctCount' | 'accuracy' | 'name'>('correctCount')
const sortOrder = ref<'asc' | 'desc'>('desc')

const sortedUsers = computed(() => {
  const sorted = [...users.value].sort((a, b) => {
    let comparison = 0
    switch (sortBy.value) {
      case 'correctCount':
        comparison = a.correctCount - b.correctCount
        break
      case 'accuracy':
        comparison = a.accuracy - b.accuracy
        break
      case 'name':
        comparison = a.userName.localeCompare(b.userName)
        break
    }
    return sortOrder.value === 'asc' ? comparison : -comparison
  })
  return sorted
})

const totalUsers = computed(() => users.value.length)
const averageAccuracy = computed(() => {
  if (users.value.length === 0) return 0
  const total = users.value.reduce((sum, user) => sum + user.accuracy, 0)
  return Math.round(total / users.value.length)
})

const changeSortBy = (column: 'correctCount' | 'accuracy' | 'name') => {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortOrder.value = 'desc'
  }
}

const formatDateTime = (dateString: string | null) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('ja-JP')
}
</script>

<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h2>ダッシュボード</h2>
      <p class="subtitle">回答者の正解数と進捗状況をリアルタイムで確認</p>
    </div>

    <div class="stats-summary">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-info">
          <div class="stat-label">総回答者数</div>
          <div class="stat-value">{{ totalUsers }}名</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-info">
          <div class="stat-label">平均正答率</div>
          <div class="stat-value">{{ averageAccuracy }}%</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-info">
          <div class="stat-label">総回答数</div>
          <div class="stat-value">{{ users.reduce((sum, u) => sum + u.totalAnswered, 0) }}件</div>
        </div>
      </div>
    </div>

    <div class="users-table-container">
      <div v-if="users.length === 0" class="empty-state">
        <p>まだ回答者のデータがありません</p>
        <p class="help-text">回答者が回答を始めるとここに表示されます</p>
      </div>

      <table v-else class="users-table">
        <thead>
          <tr>
            <th class="rank-col">順位</th>
            <th
              class="name-col sortable"
              @click="changeSortBy('name')"
            >
              回答者名
              <span class="sort-indicator" v-if="sortBy === 'name'">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th
              class="correct-col sortable"
              @click="changeSortBy('correctCount')"
            >
              正解数
              <span class="sort-indicator" v-if="sortBy === 'correctCount'">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th
              class="accuracy-col sortable"
              @click="changeSortBy('accuracy')"
            >
              正答率
              <span class="sort-indicator" v-if="sortBy === 'accuracy'">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th class="progress-col">進捗</th>
            <th class="time-col">最終回答時刻</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(user, index) in sortedUsers"
            :key="user.userId"
            :class="{ 'top-rank': index < 3 && sortBy === 'correctCount' && sortOrder === 'desc' }"
          >
            <td class="rank-col">
              <span class="rank-badge" :class="`rank-${index + 1}`">
                {{ index + 1 }}
              </span>
            </td>
            <td class="name-col">
              <strong>{{ user.userName }}</strong>
            </td>
            <td class="correct-col">
              <span class="correct-count">{{ user.correctCount }}</span>
            </td>
            <td class="accuracy-col">
              <div class="accuracy-display">
                <span class="accuracy-value">{{ user.accuracy }}%</span>
                <div class="accuracy-bar">
                  <div
                    class="accuracy-fill"
                    :style="{ width: user.accuracy + '%' }"
                  ></div>
                </div>
              </div>
            </td>
            <td class="progress-col">
              {{ user.totalAnswered }} 問回答
            </td>
            <td class="time-col">
              {{ formatDateTime(user.lastAnsweredAt) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h2 {
  margin: 0;
  color: #2c3e50;
}

.subtitle {
  margin: 0.5rem 0 0;
  color: #666;
  font-size: 0.95rem;
}

.stats-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
}

.stat-icon {
  font-size: 2.5rem;
  opacity: 0.9;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 0.85rem;
  opacity: 0.9;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
}

.users-table-container {
  overflow-x: auto;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #999;
}

.empty-state p {
  margin: 0.5rem 0;
}

.help-text {
  font-size: 0.9rem;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.users-table thead {
  background: #f5f5f5;
}

.users-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e0e0e0;
}

.users-table th.sortable {
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
}

.users-table th.sortable:hover {
  background: #ebebeb;
}

.sort-indicator {
  margin-left: 0.5rem;
  color: #0ea5e9;
}

.users-table td {
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.users-table tbody tr {
  transition: background 0.2s;
}

.users-table tbody tr:hover {
  background: #f9f9f9;
}

.users-table tbody tr.top-rank {
  background: #fffbf0;
}

.rank-col {
  width: 80px;
  text-align: center;
}

.rank-badge {
  display: inline-block;
  width: 40px;
  height: 40px;
  line-height: 40px;
  border-radius: 50%;
  background: #e0e0e0;
  color: #666;
  font-weight: bold;
}

.rank-badge.rank-1 {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #8b6914;
  box-shadow: 0 2px 4px rgba(255, 215, 0, 0.4);
}

.rank-badge.rank-2 {
  background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
  color: #5a5a5a;
  box-shadow: 0 2px 4px rgba(192, 192, 192, 0.4);
}

.rank-badge.rank-3 {
  background: linear-gradient(135deg, #cd7f32 0%, #e09856 100%);
  color: #5a3a1a;
  box-shadow: 0 2px 4px rgba(205, 127, 50, 0.4);
}

.name-col {
  min-width: 150px;
}

.correct-col {
  width: 100px;
  text-align: center;
}

.correct-count {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 20px;
  font-weight: bold;
}

.accuracy-col {
  width: 180px;
}

.accuracy-display {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.accuracy-value {
  min-width: 50px;
  font-weight: 600;
  color: #0ea5e9;
}

.accuracy-bar {
  flex: 1;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.accuracy-fill {
  height: 100%;
  background: linear-gradient(90deg, #0ea5e9 0%, #0284c7 100%);
  transition: width 0.3s ease;
}

.progress-col {
  width: 120px;
  text-align: center;
  color: #666;
}

.time-col {
  width: 180px;
  color: #999;
  font-size: 0.9rem;
}
</style>
