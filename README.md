# クイズイベントアプリ

社内イベントや勉強会で使えるリアルタイムクイズアプリケーションです。管理者が問題を作成・出題し、参加者がスマートフォンから回答できます。

## 特徴

- **リアルタイム同期**: Supabaseを使用した即座の状態同期
- **シンプルな認証**: URLパラメータベースの簡易アクセス制御
- **画像対応**: 問題文と選択肢に画像を添付可能
- **2つのモード**:
  - 管理画面（PC）: 問題作成、進行管理、結果確認
  - 回答者画面（モバイル）: クイズ回答、履歴確認
- **柔軟な問題管理**: 問題の有効/無効切り替え、並び替え、正誤判定表示設定
- **ダッシュボード**: 回答者の成績をリアルタイムで確認

## 技術スタック

- **フロントエンド**: Vue 3 + TypeScript + Vite
- **バックエンド**: Supabase (PostgreSQL)
- **ストレージ**: Supabase Storage
- **ルーティング**: Vue Router
- **スタイリング**: Apple Design System (カスタムCSS)

## 必要要件

- Node.js: v20.19.0以上 または v22.12.0以上
- npm または yarn
- Supabaseアカウント

## セットアップ

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd quiz_event_app
```

### 2. 依存関係のインストール

```bash
cd quiz-app
npm install
```

### 3. Supabaseプロジェクトの設定

1. [Supabase](https://supabase.com)でプロジェクトを作成
2. プロジェクトのURLとanon keyを取得
3. `.env.example`をコピーして`.env`を作成

```bash
cp .env.example .env
```

4. `.env`ファイルを編集してSupabase認証情報を設定

```env
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. データベースのセットアップ

Supabaseのダッシュボードで以下のテーブルを作成します（詳細は`ANALYSIS.md`を参照）：

- `questions` - 問題データ
- `quiz_mode` - クイズモード状態
- `users` - 回答者情報
- `responses` - 回答データ

### 5. ストレージバケットの作成

Supabaseのダッシュボードで以下のバケットを作成：

- `quiz-images` (Public Bucket)

## 開発

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` にアクセスできます。

### ビルド

```bash
npm run build
```

### 型チェック

```bash
npm run type-check
```

### プレビュー（本番ビルドの確認）

```bash
npm run preview
```

## 使い方

### 管理者（出題者）

1. `http://localhost:5173/admin` にアクセス
2. 問題を作成・編集
3. クイズモードを開始
4. 問題を1つずつ有効化して出題
5. ダッシュボードで回答状況を確認
6. クイズ終了後、結果を確認

### 回答者（参加者）

1. 管理者から共有されたURLにアクセス（例: `http://localhost:5173/participant?user=山田太郎`）
2. クイズ開始を待つ
3. 問題が出題されたら選択肢を選んで回答
4. 「次へ」ボタンで次の問題に進む
5. 全問題終了後、結果画面で成績を確認

## アクセス方法

- **ホーム画面**: `/`
- **管理画面**: `/admin`
- **回答者画面**: `/participant?user={回答者名}`

## プロジェクト構成

```
quiz-app/
├── src/
│   ├── assets/          # スタイルシート、画像
│   ├── components/      # Vueコンポーネント
│   │   ├── admin/       # 管理画面用コンポーネント
│   │   └── participant/ # 回答者画面用コンポーネント
│   ├── router/          # Vue Router設定
│   ├── supabase/        # Supabase設定・API
│   ├── types/           # TypeScript型定義
│   ├── utils/           # ユーティリティ関数
│   ├── views/           # ページコンポーネント
│   ├── App.vue          # ルートコンポーネント
│   └── main.ts          # エントリーポイント
├── public/              # 静的ファイル
├── .env                 # 環境変数（gitignore）
├── .env.example         # 環境変数のサンプル
├── package.json         # 依存関係
└── vite.config.ts       # Vite設定
```

## データ構造

### Question（問題）

```typescript
interface Question {
  id: string
  order: number
  text: string
  images: string[]
  options: QuestionOption[]
  correctAnswer: number
  showCorrectAnswer: boolean
  isActive: boolean
  isDeleted: boolean
}
```

### QuestionOption（選択肢）

```typescript
interface QuestionOption {
  text: string
  image: string | null
}
```

### User（回答者）

```typescript
interface User {
  id: string
  name: string
  isDeleted: boolean
  createdAt: string
}
```

### Response（回答）

```typescript
interface Response {
  selectedAnswer: number
  isCorrect: boolean
  answeredAt: string
}
```

## 主な機能

### 管理画面

- **問題管理**
  - 問題の作成・編集・削除（論理削除）
  - 画像アップロード（問題文・選択肢）
  - 問題の並び替え
  - 問題の有効/無効切り替え

- **クイズ進行管理**
  - クイズモードの開始/終了
  - 問題の有効化制御
  - 正誤判定表示設定

- **ダッシュボード**
  - 回答者一覧と成績
  - 正解数・正答率の表示
  - リアルタイム更新

- **回答者管理**
  - 回答者の追加・削除
  - URLの生成とコピー

### 回答者画面

- **クイズ回答**
  - 問題の表示と回答
  - 回答確認モーダル
  - 次の問題への遷移

- **回答履歴**
  - 過去の回答確認
  - 正誤判定の表示（設定に応じて）

- **結果画面**
  - 総合成績の表示
  - 全問題の回答結果一覧

## 制約事項

- URLパラメータによる簡易認証（ログイン機能なし）
- 回答は一度確定すると修正不可
- Supabase無料枠の制限（ストレージ1GB、データベース500MB等）
- 同時接続は100名程度を想定

## トラブルシューティング

### ビルドエラーが出る場合

```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### Supabaseに接続できない場合

1. `.env`ファイルが正しく設定されているか確認
2. SupabaseのURLとanon keyが正しいか確認
3. Supabaseプロジェクトがアクティブか確認

### 画像がアップロードできない場合

1. Supabase Storageで`quiz-images`バケットが作成されているか確認
2. バケットの権限設定を確認（Public Bucketに設定）

## ライセンス

このプロジェクトは私的利用を目的としています。

## 参考資料

- [Vue 3 公式ドキュメント](https://vuejs.org/)
- [Supabase 公式ドキュメント](https://supabase.com/docs)
- [TypeScript 公式ドキュメント](https://www.typescriptlang.org/docs/)
- [Vite 公式ドキュメント](https://vite.dev/)

## 詳細仕様

プロジェクトの詳細な要件定義については、`ANALYSIS.md`を参照してください。
