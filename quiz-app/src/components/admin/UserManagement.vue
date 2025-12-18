<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { User } from '../../types'
import {
  createUser,
  getUsers,
  getUserByName,
  deleteUser as deleteUserDB,
  subscribeToUsers
} from '../../supabase/database'

const users = ref<User[]>([])
const loading = ref(true)
const newUserName = ref('')
const showAddForm = ref(false)
const adding = ref(false)

let unsubscribe: (() => void) | null = null

onMounted(async () => {
  try {
    // 初回データ取得
    users.value = await getUsers()

    // リアルタイム購読
    unsubscribe = subscribeToUsers((updatedUsers) => {
      users.value = updatedUsers
    })
  } catch (e: any) {
    console.error('Error loading users:', e)
    alert(`エラー: ${e.message}`)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

const activeUsers = computed(() => {
  return users.value.filter(u => !u.isDeleted)
})

const addUser = async () => {
  if (!newUserName.value.trim()) {
    alert('回答者名を入力してください')
    return
  }

  try {
    adding.value = true

    // 重複チェック
    const existing = await getUserByName(newUserName.value.trim())
    if (existing) {
      alert('同じ名前の回答者が既に存在します')
      return
    }

    await createUser(newUserName.value.trim())
    newUserName.value = ''
    showAddForm.value = false
  } catch (e: any) {
    console.error('Error adding user:', e)
    alert(`エラー: ${e.message}`)
  } finally {
    adding.value = false
  }
}

const deleteUser = async (user: User) => {
  if (confirm(`${user.name} さんを削除してもよろしいですか？`)) {
    try {
      await deleteUserDB(user.id)
    } catch (e: any) {
      console.error('Error deleting user:', e)
      alert(`エラー: ${e.message}`)
    }
  }
}

const copyUrl = (user: User) => {
  const url = `${window.location.origin}?user=${encodeURIComponent(user.name)}`
  navigator.clipboard.writeText(url).then(() => {
    alert('URLをコピーしました')
  }).catch(() => {
    alert('URLのコピーに失敗しました')
  })
}
</script>

<template>
  <div class="user-management">
    <div v-if="loading" class="loading-state">
      <p>読み込み中...</p>
    </div>

    <template v-else>
      <div class="header">
        <div>
          <h2>回答者管理</h2>
          <p class="subtitle">回答者の追加とURLの発行</p>
        </div>
        <button
          class="btn-add"
          @click="showAddForm = !showAddForm"
        >
          {{ showAddForm ? 'キャンセル' : '回答者を追加' }}
        </button>
      </div>

      <div v-if="showAddForm" class="add-form">
        <div class="form-group">
          <label>回答者名</label>
          <div class="input-group">
            <input
              v-model="newUserName"
              type="text"
              placeholder="例: 山田太郎"
              @keyup.enter="addUser"
              :disabled="adding"
            >
            <button class="btn-primary" @click="addUser" :disabled="adding">
              {{ adding ? '追加中...' : '追加' }}
            </button>
          </div>
          <p class="help-text">
            追加後、その回答者専用のURLが生成されます
          </p>
        </div>
      </div>

      <div class="users-section">
      <div v-if="activeUsers.length === 0" class="empty-state">
        <p>まだ回答者が登録されていません</p>
        <p class="help-text">「回答者を追加」ボタンから回答者を登録してください</p>
      </div>

      <div v-else class="users-grid">
        <div
          v-for="user in activeUsers"
          :key="user.id"
          class="user-card"
        >
          <div class="user-card-header">
            <div class="user-icon">👤</div>
            <div class="user-info">
              <div class="user-name">{{ user.name }}</div>
              <div class="user-meta">
                登録日時: {{ new Date(user.createdAt).toLocaleString('ja-JP') }}
              </div>
            </div>
          </div>

          <div class="user-url">
            <label>専用URL</label>
            <div class="url-display">
              <input
                type="text"
                :value="`${window.location.origin}?user=${encodeURIComponent(user.name)}`"
                readonly
              >
              <button
                class="btn-copy"
                @click="copyUrl(user)"
              >
                コピー
              </button>
            </div>
          </div>

          <div class="user-actions">
            <button
              class="btn-delete"
              @click="deleteUser(user)"
            >
              削除
            </button>
          </div>
        </div>
      </div>
    </div>

      <div class="info-box">
        <h3>💡 使い方</h3>
        <ol>
          <li>回答者を追加すると、その人専用のURLが生成されます</li>
          <li>URLをコピーして回答者に共有してください</li>
          <li>回答者はそのURLにアクセスすることでクイズに参加できます</li>
          <li>URLパラメータに回答者名が含まれているため、ログイン不要です</li>
        </ol>
      </div>
    </template>
  </div>
</template>

<style scoped>
.user-management {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.loading-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.header h2 {
  margin: 0;
  color: #2c3e50;
}

.subtitle {
  margin: 0.5rem 0 0;
  color: #666;
  font-size: 0.9rem;
}

.btn-add {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.4);
}

.add-form {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.input-group {
  display: flex;
  gap: 0.75rem;
}

.input-group input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.4);
}

.help-text {
  margin: 0.5rem 0 0;
  font-size: 0.85rem;
  color: #666;
}

.users-section {
  margin-bottom: 2rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #999;
}

.empty-state p {
  margin: 0.5rem 0;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.user-card {
  background: #f9f9f9;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s;
}

.user-card:hover {
  border-color: #0ea5e9;
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.2);
}

.user-card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.user-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.user-meta {
  font-size: 0.85rem;
  color: #999;
}

.user-url {
  margin-bottom: 1rem;
}

.user-url label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #666;
}

.url-display {
  display: flex;
  gap: 0.5rem;
}

.url-display input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.85rem;
  background: white;
  font-family: monospace;
}

.btn-copy {
  background: #4caf50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.btn-copy:hover {
  background: #45a049;
}

.user-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-delete {
  background: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.btn-delete:hover {
  background: #d32f2f;
}

.info-box {
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
  padding: 1.5rem;
  border-radius: 4px;
}

.info-box h3 {
  margin: 0 0 1rem;
  color: #1976d2;
}

.info-box ol {
  margin: 0;
  padding-left: 1.5rem;
  color: #555;
}

.info-box li {
  margin: 0.5rem 0;
}
</style>
