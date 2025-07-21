# 教室予約システム

`reservation_with_results.html`を参考にして作成された、部活動の教室予約を管理するWebアプリケーションです。

## 機能

### 学生機能
- 部活動ログイン（部活名とパスワード）
- 教室予約申請フォーム
- 抽選結果の表示（当選/落選）
- 申請データのJSON出力
- 抽選履歴の閲覧

### 教務機能
- 教務ログイン（パスワード認証）
- 教室一覧表示
- 教室利用可否の変更
- 予約申請の承認/却下
- システム設定（注意事項、抽選設定）
- 抽選実行・履歴の確認
- ポイント管理

## 技術スタック

- **フロントエンド**: Next.js 15.3.3 (最新) + App Router, TypeScript, Tailwind CSS v4
- **バックエンド**: Next.js API Routes + Prisma ORM 6.11.1
- **データベース**: SQLite (開発環境) / PostgreSQL・MySQL 等に置き換え可能
- **UI Framework**: Radix UI, Lucide React Icons
- **スタイリング**: Tailwind CSS v4 (最新) + Tailwind Animate
- **開発環境**: Turbopack対応, TypeScript 5, React 19.0.0

## セットアップ

### 前提条件
- Node.js 18以上
- npm または yarn

### インストール

1. プロジェクトディレクトリに移動
```bash
cd pbl_sample/webapp/frontend
```

2. 依存関係をインストール
```bash
npm install
```

3. 開発サーバーを起動（Turbopack使用）
```bash
npm run dev
```

4. ブラウザで http://localhost:3000 にアクセス

### データベースの準備

1. プロジェクトルートに `.env` を作成し、以下を記述します（SQLite 利用例）。

```env
DATABASE_PROVIDER=sqlite
DATABASE_URL="file:./prisma/dev.db"
```

2. スキーマをDBに適用（初回のみ）

```bash
npx prisma db push
```

> `npm install` 実行時に `prisma generate` と `prisma migrate deploy` が自動実行されるため、通常は追加操作は不要です。

## 使用方法

### 学生としてログイン
1. ホームページで「学生ログイン」をクリック
2. 部活動を選択（例：野球部）
3. パスワードを入力（例：baseball）
4. 教室予約申請フォームで希望する教室と日時を選択
5. 「申込を完了」をクリック

### 教務としてログイン
1. ホームページで「教務ログイン」をクリック
2. パスワードを入力（admin）
3. タブを切り替えて各種管理機能を使用

## サンプルデータ

### 部活動
- 野球部 (パスワード: baseball)
- サッカー部 (パスワード: soccer)
- 軽音学部 (パスワード: lightmusic)
- その他多数

### 教室
- C101-C409: 各種講義室
- 定員: 36-309人
- 席タイプ: 固定席、セパレート席

### 教務
- パスワード: admin

## プロジェクト構成

```
src/
├── app/                     # Next.js App Router
│   ├── api/                 # API Routes
│   │   ├── classrooms/route.ts    # 教室データAPI
│   │   ├── clubs/route.ts         # 部活データAPI
│   │   ├── reservations/route.ts  # 予約データAPI
│   │   └── lottery/route.ts       # 抽選API
│   ├── admin/               # 教務用ページ
│   ├── student/             # 学生用ページ
│   ├── lottery-results/     # 抽選結果ページ
│   ├── globals.css          # グローバルスタイル
│   ├── layout.tsx           # ルートレイアウト
│   └── page.tsx             # ホームページ
├── components/              # 再利用可能コンポーネント
├── lib/                     # ユーティリティ関数
└── utils/                   # 共通処理
```

## 開発スクリプト

```bash
# 開発サーバー起動（Turbopack使用）
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm start

# リンター実行
npm run lint
```

## 主要依存関係

### フロントエンド
- **Next.js**: 15.3.3 (React 19対応、Turbopack安定版)
- **React**: 19.0.0 (最新安定版)
- **TypeScript**: 5.x (型安全性)
- **Tailwind CSS**: v4 (最新、改良されたパフォーマンス)

### UI コンポーネント
- **Radix UI**: モダンなUIプリミティブ
- **Lucide React**: アイコンライブラリ
- **class-variance-authority**: CSS-in-JSユーティリティ
- **next-themes**: ダークモードサポート

### データベース・バックエンド
- **Prisma**: 6.11.1 (最新ORM)
- **SQLite**: 開発環境用DB

## 最新機能

### Next.js 15の新機能
- **React 19サポート**: 最新のReact機能を活用
- **Turbopack安定版**: 高速な開発体験
- **改善されたキャッシュ戦略**: より柔軟なデータ管理
- **Error UIの改善**: 開発時のデバッグ体験向上

### Tailwind CSS v4の新機能
- **ゼロランタイム**: CSS-in-JSからの移行
- **改善されたパフォーマンス**: より高速なビルド
- **新しいカラーパレット**: モダンなデザインシステム

## ライセンス

このプロジェクトは教育目的で作成されています。
