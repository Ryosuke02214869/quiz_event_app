import { supabase } from './config'

const BUCKET_NAME = 'quiz-images'

// 画像をアップロード
export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    // ファイルサイズチェック（5MB制限）
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      throw new Error('ファイルサイズが大きすぎます。5MB以下の画像を選択してください。')
    }

    // ファイルタイプチェック
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('サポートされていない画像形式です。JPEG、PNG、GIF、WebPのみ対応しています。')
    }

    // ファイル名を一意にする
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = `${path}/${fileName}`

    // アップロード
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      throw new Error(`画像のアップロードに失敗しました: ${error.message}`)
    }

    // 公開URLを取得
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path)

    return urlData.publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

// 複数の画像をアップロード
export const uploadMultipleImages = async (
  files: File[],
  path: string
): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadImage(file, path))
  return Promise.all(uploadPromises)
}

// 画像を削除
export const deleteImage = async (url: string): Promise<void> => {
  try {
    // URLからパスを抽出
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split(`/${BUCKET_NAME}/`)
    if (pathParts.length < 2) {
      throw new Error('無効な画像URLです。')
    }
    const filePath = pathParts[1]
    if (!filePath) {
      throw new Error('ファイルパスが取得できませんでした。')
    }

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])

    if (error) {
      console.error('Delete error:', error)
      throw new Error(`画像の削除に失敗しました: ${error.message}`)
    }
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}

// 複数の画像を削除
export const deleteMultipleImages = async (urls: string[]): Promise<void> => {
  const deletePromises = urls.map(url => deleteImage(url))
  await Promise.all(deletePromises)
}

// 問題画像のパスを生成
export const getQuestionImagePath = (questionId: string) => {
  return `questions/${questionId}/main`
}

// 選択肢画像のパスを生成
export const getOptionImagePath = (questionId: string) => {
  return `questions/${questionId}/options`
}

// バケットが存在するか確認（初期セットアップ用）
export const checkBucketExists = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage.getBucket(BUCKET_NAME)
    if (error) {
      console.error('Bucket check error:', error)
      return false
    }
    return !!data
  } catch (error) {
    console.error('Error checking bucket:', error)
    return false
  }
}

// 画像URLが有効かチェック
export const validateImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url)
    return urlObj.pathname.includes(`/${BUCKET_NAME}/`)
  } catch {
    return false
  }
}
