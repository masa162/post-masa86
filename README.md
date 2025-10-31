# post-masa86

ミニマルなテキストベース雑記ブログ - Next.js 15 + Cloudflare Pages + D1

**URL**: https://blog.masa86.com  
**管理画面**: https://blog.masa86.com/admin

## ✨ 主な機能

- ✍️ Markdown記事投稿（管理画面から）
- 🔍 フルテキスト検索
- 🏷️ タグ管理
- 📱 レスポンシブデザイン
- 🔐 Basic認証（管理画面）
- 🗺️ サイトマップ自動生成
- 🚀 Edge Runtime（Cloudflare Workers）
- 📺 YouTube埋め込み対応

## 🛠 技術スタック

- **フロントエンド**: Next.js 15 (App Router), React 19, TypeScript
- **スタイリング**: TailwindCSS, Custom CSS
- **データベース**: Cloudflare D1 (SQLite) - 50件の記事
- **ホスティング**: Cloudflare Pages
- **ランタイム**: Cloudflare Workers (Edge)

## 📊 実装完了状況

- ✅ Phase 1: Hello World
- ✅ Phase 2: D1接続テスト
- ✅ Phase 3: 記事詳細ページ
- ✅ Phase 4: 49件のデータ移行
- ✅ Phase 5: 管理画面（CRUD）
- ✅ Phase 6: Markdown表示改善
- ✅ Phase 7: Sidebar、検索、タグ機能

## 🔑 管理画面

**URL**: https://blog.masa86.com/admin

認証情報は環境変数で管理（Cloudflare Dashboard設定）

## 🚀 開発

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build
```

## 📁 プロジェクト構造

```
post-masa86/
├── app/              # Next.js App Router
│   ├── page.tsx     # トップページ
│   ├── [slug]/      # 記事詳細
│   ├── tags/        # タグページ
│   ├── search/      # 検索ページ
│   ├── admin/       # 管理画面
│   └── api/         # API Routes
├── components/      # Reactコンポーネント
├── lib/            # ユーティリティ・DB
├── types/          # 型定義
└── scripts/        # マイグレーション
```

## 📝 重要な設計判断

### wrangler.tomlを使用しない
- 全ての設定はCloudflare Dashboardで管理
- compatibility_flagsの上書き問題を回避

### 段階的実装
- Phase 1: Hello World から開始
- 各Phaseで動作確認
- 確実に動作することを確認してから次へ

### clasicjlit方式を踏襲
- `process.env.DB`でD1アクセス
- `dynamic = 'force-dynamic'`を全ルートに設定
- シンプルなnext.config.js

## 📚 ドキュメント

- [要件定義書](./docs/要件定義書.md)
- [技術仕様書](./docs/技術仕様書.md)
- [実装ステップ](./docs/実装ステップ.md)

## 📈 データ

- **記事数**: 50件（Hugo移行49件 + テスト1件）
- **Slug範囲**: 0001～0050
- **データベースサイズ**: 0.18MB

---

**作成日**: 2025-10-31  
**バージョン**: 1.0.0  
**メンテナー**: [@masa162](https://github.com/masa162)

