<script setup lang="ts">
import { ref } from 'vue'
import type { Question } from '../../types'
import QuestionForm from './QuestionForm.vue'
import QuestionList from './QuestionList.vue'

const showForm = ref(false)
const editingQuestion = ref<Question | null>(null)

const openCreateForm = () => {
  editingQuestion.value = null
  showForm.value = true
}

const openEditForm = (question: Question) => {
  editingQuestion.value = question
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingQuestion.value = null
}

const handleSave = () => {
  closeForm()
}
</script>

<template>
  <div class="question-management">
    <div class="header">
      <h2>問題管理</h2>
      <button class="btn-primary" @click="openCreateForm">
        新規作成
      </button>
    </div>

    <QuestionForm
      v-if="showForm"
      :question="editingQuestion"
      @save="handleSave"
      @cancel="closeForm"
    />

    <QuestionList
      v-if="!showForm"
      @edit="openEditForm"
    />
  </div>
</template>

<style scoped>
.question-management {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h2 {
  margin: 0;
  color: #2c3e50;
}

.btn-primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.4);
}
</style>
