<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { Question, QuestionOption } from '../../types'
import { createQuestion, updateQuestion, getQuestions } from '../../supabase/database'
import { uploadImage, getQuestionImagePath, getOptionImagePath } from '../../supabase/storage'
import { validateImage } from '../../utils/imageUtils'

interface Props {
  question?: Question | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  save: []
  cancel: []
}>()

const form = reactive({
  text: '',
  images: [] as string[],
  options: [
    { text: '', image: null },
    { text: '', image: null },
    { text: '', image: null },
    { text: '', image: null }
  ] as QuestionOption[],
  correctAnswer: 0,
  showCorrectAnswer: true
})

const uploading = ref(false)
const uploadingFiles = ref<File[]>([])

watch(() => props.question, (question) => {
  if (question) {
    form.text = question.text
    form.images = [...question.images]
    form.options = [...question.options]
    form.correctAnswer = question.correctAnswer
    form.showCorrectAnswer = question.showCorrectAnswer
  } else {
    // 新規作成時はフォームをリセット
    form.text = ''
    form.images = []
    form.options = [
      { text: '', image: null },
      { text: '', image: null },
      { text: '', image: null },
      { text: '', image: null }
    ]
    form.correctAnswer = 0
    form.showCorrectAnswer = true
  }
}, { immediate: true })

const handleImageUpload = async (event: Event, type: 'question' | 'option', index?: number) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || !files[0]) return

  const file = files[0]

  // 画像検証
  const validation = validateImage(file)
  if (!validation.valid) {
    alert(validation.error)
    return
  }

  // プレビュー用にDataURLを生成
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    if (type === 'question') {
      form.images.push(result)
    } else if (type === 'option' && index !== undefined) {
      form.options[index].image = result
    }
  }
  reader.readAsDataURL(file)

  // アップロード用にファイルを保存
  uploadingFiles.value.push(file)
}

const removeQuestionImage = (index: number) => {
  form.images.splice(index, 1)
}

const removeOptionImage = (index: number) => {
  form.options[index].image = null
}

const handleSubmit = async () => {
  if (!form.text.trim()) {
    alert('問題文を入力してください')
    return
  }
  if (form.options.some(opt => !opt.text.trim())) {
    alert('すべての選択肢を入力してください')
    return
  }

  try {
    uploading.value = true

    // 問題IDを取得（新規作成時は仮IDを使用）
    const questionId = props.question?.id || `temp-${Date.now()}`

    // 画像をアップロード
    const uploadedImages: string[] = []
    for (let i = 0; i < form.images.length; i++) {
      const imageData = form.images[i]

      // DataURLの場合はアップロード対象
      if (imageData.startsWith('data:')) {
        const file = uploadingFiles.value.shift()
        if (file) {
          const url = await uploadImage(file, getQuestionImagePath(questionId))
          uploadedImages.push(url)
        }
      } else {
        // 既存のURLはそのまま使用
        uploadedImages.push(imageData)
      }
    }

    // 選択肢の画像をアップロード
    const uploadedOptions: QuestionOption[] = []
    for (let i = 0; i < form.options.length; i++) {
      const option = form.options[i]
      let imageUrl = option.image

      if (imageUrl && imageUrl.startsWith('data:')) {
        const file = uploadingFiles.value.shift()
        if (file) {
          imageUrl = await uploadImage(file, getOptionImagePath(questionId))
        }
      }

      uploadedOptions.push({
        text: option.text,
        image: imageUrl
      })
    }

    // 問題の順番を取得
    let order = 1
    if (!props.question) {
      const questions = await getQuestions()
      order = questions.length > 0 ? Math.max(...questions.map(q => q.order)) + 1 : 1
    }

    // データベースに保存
    if (props.question) {
      // 更新
      await updateQuestion(props.question.id, {
        text: form.text,
        images: uploadedImages,
        options: uploadedOptions,
        correctAnswer: form.correctAnswer,
        showCorrectAnswer: form.showCorrectAnswer
      })
    } else {
      // 新規作成
      await createQuestion({
        order,
        text: form.text,
        images: uploadedImages,
        options: uploadedOptions,
        correctAnswer: form.correctAnswer,
        showCorrectAnswer: form.showCorrectAnswer,
        isActive: false,
        isDeleted: false
      })
    }

    uploadingFiles.value = []
    emit('save')
  } catch (error: any) {
    console.error('Error saving question:', error)
    alert(`エラーが発生しました: ${error.message}`)
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <div class="question-form">
    <h3>{{ question ? '問題を編集' : '新しい問題を作成' }}</h3>

    <div class="form-group">
      <label>問題文</label>
      <textarea
        v-model="form.text"
        placeholder="問題文を入力してください"
        rows="4"
      ></textarea>
    </div>

    <div class="form-group">
      <label>問題画像（最大3枚）</label>
      <div class="image-upload-area">
        <div v-for="(image, index) in form.images" :key="index" class="image-preview">
          <img :src="image" alt="問題画像">
          <button type="button" class="btn-remove" @click="removeQuestionImage(index)">
            削除
          </button>
        </div>
        <div v-if="form.images.length < 3" class="upload-box">
          <input
            type="file"
            accept="image/*"
            @change="handleImageUpload($event, 'question')"
          >
          <span>画像を追加</span>
        </div>
      </div>
    </div>

    <div class="form-group">
      <label>選択肢</label>
      <div v-for="(option, index) in form.options" :key="index" class="option-group">
        <div class="option-header">
          <input
            type="radio"
            :id="`correct-${index}`"
            :value="index"
            v-model="form.correctAnswer"
          >
          <label :for="`correct-${index}`" class="correct-label">
            選択肢 {{ index + 1 }} (正解)
          </label>
        </div>
        <input
          v-model="option.text"
          type="text"
          :placeholder="`選択肢${index + 1}のテキスト`"
          class="option-text"
        >
        <div class="option-image">
          <div v-if="option.image" class="image-preview small">
            <img :src="option.image" alt="選択肢画像">
            <button type="button" class="btn-remove small" @click="removeOptionImage(index)">
              削除
            </button>
          </div>
          <div v-else class="upload-box small">
            <input
              type="file"
              accept="image/*"
              @change="handleImageUpload($event, 'option', index)"
            >
            <span>画像を追加</span>
          </div>
        </div>
      </div>
    </div>

    <div class="form-group">
      <label class="checkbox-label">
        <input type="checkbox" v-model="form.showCorrectAnswer">
        正誤判定を表示する
      </label>
      <p class="help-text">
        チェックを入れると、回答者が正解か不正解かを確認できます
      </p>
    </div>

    <div class="form-actions">
      <button type="button" class="btn-secondary" @click="emit('cancel')">
        キャンセル
      </button>
      <button type="button" class="btn-primary" @click="handleSubmit">
        保存
      </button>
    </div>
  </div>
</template>

<style scoped>
.question-form {
  background: #f9f9f9;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.question-form h3 {
  margin: 0 0 1.5rem;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.form-group textarea,
.form-group input[type="text"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.image-upload-area {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.image-preview {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #ddd;
}

.image-preview.small {
  width: 100px;
  height: 100px;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-remove {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(255, 0, 0, 0.8);
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.btn-remove.small {
  padding: 0.2rem 0.4rem;
  font-size: 0.7rem;
}

.upload-box {
  width: 150px;
  height: 150px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: border-color 0.3s;
}

.upload-box.small {
  width: 100px;
  height: 100px;
}

.upload-box:hover {
  border-color: #0ea5e9;
}

.upload-box input[type="file"] {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.upload-box span {
  color: #999;
  font-size: 0.9rem;
}

.option-group {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.option-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.correct-label {
  margin: 0;
  font-weight: 600;
  color: #0ea5e9;
}

.option-text {
  margin-bottom: 0.5rem;
}

.option-image {
  margin-top: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: normal;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  cursor: pointer;
}

.help-text {
  margin: 0.5rem 0 0;
  font-size: 0.85rem;
  color: #666;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #e0e0e0;
  color: #666;
}

.btn-secondary:hover {
  background: #d0d0d0;
}
</style>
