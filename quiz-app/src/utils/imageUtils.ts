// 画像をBase64に変換
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // ファイルサイズチェック（5MB制限）
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      reject(new Error('ファイルサイズが大きすぎます。5MB以下の画像を選択してください。'))
      return
    }

    // ファイルタイプチェック
    if (!file.type.startsWith('image/')) {
      reject(new Error('画像ファイルを選択してください。'))
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      const result = reader.result as string
      resolve(result)
    }

    reader.onerror = () => {
      reject(new Error('ファイルの読み込みに失敗しました。'))
    }

    reader.readAsDataURL(file)
  })
}

// 画像を圧縮してBase64に変換
export const compressAndConvertToBase64 = (
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // ファイルタイプチェック
    if (!file.type.startsWith('image/')) {
      reject(new Error('画像ファイルを選択してください。'))
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()

      img.onload = () => {
        // キャンバスを作成
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // アスペクト比を保ちながらリサイズ
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = width * ratio
          height = height * ratio
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('画像の処理に失敗しました。'))
          return
        }

        // 画像を描画
        ctx.drawImage(img, 0, 0, width, height)

        // Base64に変換
        try {
          const base64 = canvas.toDataURL('image/jpeg', quality)

          // サイズチェック（圧縮後も1MB以下が望ましい）
          const sizeInMB = (base64.length * 3) / 4 / (1024 * 1024)
          if (sizeInMB > 2) {
            console.warn(`警告: 圧縮後の画像サイズが大きいです (${sizeInMB.toFixed(2)}MB)`)
          }

          resolve(base64)
        } catch (error) {
          reject(new Error('画像の変換に失敗しました。'))
        }
      }

      img.onerror = () => {
        reject(new Error('画像の読み込みに失敗しました。'))
      }

      img.src = e.target?.result as string
    }

    reader.onerror = () => {
      reject(new Error('ファイルの読み込みに失敗しました。'))
    }

    reader.readAsDataURL(file)
  })
}

// Base64文字列のサイズを取得（MB単位）
export const getBase64SizeInMB = (base64: string): number => {
  const sizeInBytes = (base64.length * 3) / 4
  return sizeInBytes / (1024 * 1024)
}

// 複数の画像を一括処理
export const processMultipleImages = async (
  files: File[],
  maxImages: number = 3
): Promise<string[]> => {
  if (files.length > maxImages) {
    throw new Error(`画像は最大${maxImages}枚までです。`)
  }

  const promises = Array.from(files).map(file =>
    compressAndConvertToBase64(file)
  )

  return Promise.all(promises)
}

// 画像のプレビュー用にサムネイルを生成
export const generateThumbnail = (
  file: File,
  maxWidth: number = 200,
  maxHeight: number = 200
): Promise<string> => {
  return compressAndConvertToBase64(file, maxWidth, maxHeight, 0.7)
}

// Base64からファイルサイズを推定
export const estimateImageSize = (base64: string): string => {
  const sizeInMB = getBase64SizeInMB(base64)

  if (sizeInMB < 0.1) {
    return `${(sizeInMB * 1024).toFixed(0)} KB`
  }
  return `${sizeInMB.toFixed(2)} MB`
}

// 画像の検証
export const validateImage = (file: File): { valid: boolean; error?: string } => {
  // ファイルタイプチェック
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'サポートされていない画像形式です。JPEG、PNG、GIF、WebPのみ対応しています。'
    }
  }

  // ファイルサイズチェック（5MB）
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'ファイルサイズが大きすぎます。5MB以下の画像を選択してください。'
    }
  }

  return { valid: true }
}
