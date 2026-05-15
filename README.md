# PackTune

## 概要

PackTune は、旅行の経験を蓄積しながら、自分専用の持ち物リストを育てていくアプリです。

ユーザーは旅行ごとに持ち物を記録し、旅行後に「不要だったもの」「持っていけばよかったもの」をフィードバックできます。

フィードバック結果をもとにアイテムごとのスコアが蓄積され、次回以降の旅行ではユーザーに合った持ち物が提案されます。

---

## 機能

- メール認証によるログイン
- 旅行の作成
- 持ち物提案
- 持ち物リストの管理
- ふりかえり機能
- スタッツ画面

---

## 使用技術

- React（TypeScript）
- Vite
- React Router
- Supabase
  - Authentication
  - Database
- Chakra UI v3
- Vitest / React Testing Library
- GitHub Actions（CI/CD）

---

## セットアップ

### 1. リポジトリをクローン

```bash
git clone https://github.com/Seripro/pack-tune.git
cd pack-tune
```

---

### 2. 依存関係のインストール

```bash
npm install
```

---

### 3. 環境変数の設定

#### 3-1. .env ファイルを作成

プロジェクト直下に `.env` を作成してください。

---

#### 3-2. Supabase のURLとAPIキーを設定

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

---

## Supabase テーブル構成

### items テーブル

| カラム名     | 型          | 説明           |
| ------------ | ----------- | -------------- |
| id           | uuid        | 主キー         |
| user_id      | uuid        | ユーザーID     |
| name         | text        | 持ち物名       |
| useful_count | integer     | 役立った回数   |
| unused_count | integer     | 不要だった回数 |
| created_at   | timestamptz | 作成日時       |

---

### trips テーブル

| カラム名     | 型          | 説明         |
| ------------ | ----------- | ------------ |
| id           | uuid        | 主キー       |
| user_id      | uuid        | ユーザーID   |
| title        | text        | 旅行タイトル |
| start_date   | date        | 開始日       |
| end_date     | date        | 終了日       |
| memo         | text        | メモ         |
| is_completed | boolean     | 完了状態     |
| created_at   | timestamptz | 作成日時     |

---

### trip_items テーブル

| カラム名   | 型          | 説明                    |
| ---------- | ----------- | ----------------------- |
| id         | uuid        | 主キー                  |
| trip_id    | uuid        | tripsテーブルの外部キー |
| item_id    | uuid        | itemsテーブルの外部キー |
| is_checked | boolean     | 持ち物チェック状態      |
| created_at | timestamptz | 作成日時                |

---

## 起動方法

```bash
npm run dev
```

---

## その他コマンド一覧

### ビルド

```bash
npm run build
```

---

### テスト

```bash
npx vitest
```

---

## 画面一覧

| URL                     | 内容           |
| ----------------------- | -------------- |
| /login                  | ログイン画面   |
| /signup                 | 新規登録画面   |
| /trips                  | 旅行一覧       |
| /trips/new              | 新規旅行作成   |
| /trips/:tripId          | 持ち物管理     |
| /trips/:tripId/feedback | フィードバック |
| /items/stats            | スタッツ画面   |

---
