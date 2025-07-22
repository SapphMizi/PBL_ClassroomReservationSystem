# データベースセットアップガイド

## 問題の解決済み修正点

- `package.json`のpostinstallスクリプトから`prisma migrate deploy`を削除
- Vercel設定に環境変数の参照を追加
- Prismaスキーマを本番環境対応（PostgreSQL）に変更

## Vercelでのデプロイ設定

### 1. Vercelプロジェクトでの環境変数設定

Vercelダッシュボードで以下の環境変数を設定してください：

```
DATABASE_URL=postgresql://username:password@hostname:port/database
```

### 2. 推奨データベースサービス

- **Vercel Postgres**: Vercel提供のPostgreSQLサービス
- **Supabase**: 無料プランあり
- **PlanetScale**: MySQL互換（別途スキーマ調整が必要）
- **Neon**: PostgreSQL互換

### 3. Vercel Postgresの設定例

1. Vercelダッシュボードで「Storage」タブ
2. 「Create Database」→「Postgres」
3. 自動でDATABASE_URLが設定される

## ローカル開発環境の設定

### Option 1: PostgreSQLをローカルで使用

1. PostgreSQLをインストール
2. `.env.local`ファイルを作成：
```
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
```

### Option 2: SQLiteをローカルで使用（簡易）

1. `prisma/schema.prisma`を一時的にSQLiteに変更：
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

2. `.env.local`ファイルを作成：
```
DATABASE_URL="file:./dev.db"
```

3. マイグレーション実行：
```bash
npm run db:push
```

## デプロイフロー

1. 本番環境でPrismaスキーマを使用する場合は`provider = "postgresql"`
2. 初回デプロイ後、データベースマイグレーション実行：
```bash
npx prisma migrate deploy
```

## トラブルシューティング

### エラー: P1012 (URL must start with protocol file:)
- 環境変数DATABASE_URLが設定されていない
- Vercelの環境変数を確認

### エラー: Can't reach database server
- データベースサービスの接続情報を確認
- ネットワーク設定やファイアウォール設定を確認 