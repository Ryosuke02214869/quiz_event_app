<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { User } from '../../types'
import {
  createUser,
  getUsers,
  getUserByName,
  deleteUser as deleteUserDB,
  subscribeToUsers
} from '../../supabase/database'
import QRCode from 'qrcode'

const users = ref<User[]>([])
const loading = ref(true)
const newUserName = ref('')
const showAddForm = ref(false)
const adding = ref(false)
const showQRModal = ref(false)
const qrUser = ref<User | null>(null)
const qrCodeDataUrl = ref('')

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

const getOrigin = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return ''
}

const getUserUrl = (userName: string) => {
  return `${getOrigin()}?user=${encodeURIComponent(userName)}`
}

const copyUrl = (user: User) => {
  const url = getUserUrl(user.name)
  navigator.clipboard.writeText(url).then(() => {
    alert('URLをコピーしました')
  }).catch(() => {
    alert('URLのコピーに失敗しました')
  })
}

const showQRCode = async (user: User) => {
  try {
    const url = getUserUrl(user.name)
    const dataUrl = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })
    qrCodeDataUrl.value = dataUrl
    qrUser.value = user
    showQRModal.value = true
  } catch (error) {
    console.error('QRコード生成エラー:', error)
    alert('QRコードの生成に失敗しました')
  }
}

const closeQRModal = () => {
  showQRModal.value = false
  qrUser.value = null
  qrCodeDataUrl.value = ''
}

const downloadQRCode = () => {
  if (!qrUser.value || !qrCodeDataUrl.value) return

  const link = document.createElement('a')
  link.download = `QR_${qrUser.value.name}.png`
  link.href = qrCodeDataUrl.value
  link.click()
}

// モーダル表示時に背景のスクロールを無効化
watch(showQRModal, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
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
                :value="getUserUrl(user.name)"
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
              class="btn-qr"
              @click="showQRCode(user)"
            >
              QRコード
            </button>
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

    <!-- QRコードモーダル -->
    <div v-if="showQRModal && qrUser" class="modal-overlay" @click="closeQRModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ qrUser.name }} さんのQRコード</h3>
          <button class="btn-close-modal" @click="closeQRModal">✕</button>
        </div>

        <div class="modal-body">
          <div class="qr-container">
            <img :src="qrCodeDataUrl" alt="QRコード" class="qr-image">
          </div>

          <div class="qr-info">
            <p class="qr-description">
              このQRコードをスキャンすると、{{ qrUser.name }} さん専用のクイズページにアクセスできます。
            </p>
            <div class="qr-url">
              <label>URL:</label>
              <div class="url-text">{{ getUserUrl(qrUser.name) }}</div>
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn-download" @click="downloadQRCode">
              画像をダウンロード
            </button>
            <button class="btn-secondary" @click="closeQRModal">
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
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
  gap: 0.5rem;
}

.btn-qr {
  background: #9c27b0;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.btn-qr:hover {
  background: #7b1fa2;
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
  overflow-y: auto;
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
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
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

.modal-body {
  padding: 2rem;
}

.qr-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.qr-image {
  width: 300px;
  height: 300px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
}

.qr-info {
  margin-bottom: 1.5rem;
}

.qr-description {
  margin: 0 0 1rem;
  color: #666;
  line-height: 1.6;
}

.qr-url {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
}

.qr-url label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #666;
}

.url-text {
  padding: 0.5rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.85rem;
  font-family: monospace;
  word-break: break-all;
  color: #2c3e50;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.btn-download {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-download:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(14, 165, 233, 0.4);
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-secondary:hover {
  background: #5a6268;
}

/* タブレット対応 (768px以下) */
@media (max-width: 768px) {
  .user-management {
    padding: 1.5rem;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .btn-add {
    width: 100%;
  }

  .users-grid {
    grid-template-columns: 1fr;
  }

  .input-group {
    flex-direction: column;
  }

  .input-group input {
    width: 100%;
  }

  .btn-primary {
    width: 100%;
  }
}

/* モバイル対応 (480px以下) */
@media (max-width: 480px) {
  .user-management {
    padding: 1rem;
    border-radius: 0;
  }

  .header h2 {
    font-size: 1.5rem;
  }

  .subtitle {
    font-size: 0.85rem;
  }

  .user-card {
    padding: 1rem;
  }

  .user-icon {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }

  .user-name {
    font-size: 1rem;
  }

  .user-meta {
    font-size: 0.75rem;
  }

  .url-display {
    flex-direction: column;
  }

  .url-display input {
    font-size: 0.75rem;
  }

  .btn-copy {
    width: 100%;
  }

  .user-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .btn-qr,
  .btn-delete {
    width: 100%;
  }

  .add-form {
    padding: 1rem;
  }

  .info-box {
    padding: 1rem;
  }

  .info-box h3 {
    font-size: 1rem;
  }

  .info-box li {
    font-size: 0.85rem;
  }

  .modal-content {
    max-width: 100%;
    margin: 0;
    border-radius: 0;
    max-height: 100vh;
  }

  .modal-header h3 {
    font-size: 1.1rem;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .qr-image {
    width: 250px;
    height: 250px;
  }

  .qr-description {
    font-size: 0.9rem;
  }

  .btn-download,
  .btn-secondary {
    padding: 0.675rem 1.25rem;
    font-size: 0.9rem;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions button {
    width: 100%;
  }
}
</style>
