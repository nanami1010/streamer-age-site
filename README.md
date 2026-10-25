# STREAMER AGE

配信者の年齢・世代・使用デバイスを掲載するAstroサイトです。配信者データはAstro Content CollectionsとZodで検証し、配信者ごとのJSONファイルとして管理します。

## 開発環境

- Astro 7
- TypeScript
- Cloudflare Workers
- Node.js 22.22.0以上

## 主な構成

```text
src/
├── content.config.ts          # 配信者データのスキーマ
├── data/
│   └── streamers/
│       └── shaka.json         # 配信者ごとのデータ
├── lib/
│   └── streamers.ts           # コレクション取得・重複検証
├── layouts/
│   └── Layout.astro           # 言語・meta情報・共通HTML構造
├── scripts/
│   └── update-displayed-ages.ts # ブラウザ上の年齢更新
├── utils/
│   └── age.ts                 # 日本時間基準の年齢計算
└── pages/
    ├── index.astro
    └── streamers/[slug].astro
```

## 配信者を追加する手順

1. `src/data/streamers/` に、`slug` と同じ名前のJSONファイルを追加します。
2. `slug` は半角英小文字・数字・ハイフンだけを使い、他の配信者と重複させないでください。
3. 生年月日と確認日は `YYYY-MM-DD` 形式で記載してください。存在しない日付や未来の日付は使用できません。
4. URLは `http://` または `https://` から始まる有効なURLを記載してください。
5. 不明な生年月日・所属・プロフィール画像は推測せず `null` にします。未確認のSNSはプロパティ自体を省略できます。
6. 根拠にしたページを `sources` に記録し、`lastVerifiedAt` を更新します。
7. `npm run build` を実行し、スキーマ違反やslug重複がないことを確認します。

最低限必要なデータの例です。

```json
{
  "name": "配信者名",
  "nameKana": "はいしんしゃめい",
  "aliases": [],
  "slug": "streamer-name",
  "birthDate": null,
  "genres": ["ゲーム配信"],
  "affiliation": null,
  "socialLinks": {},
  "profileImage": null,
  "sources": [
    {
      "field": "name",
      "url": "https://example.com/official-profile"
    }
  ],
  "lastVerifiedAt": "2026-10-22"
}
```

### 使用デバイス

`devices` は任意です。確認できたデバイスだけを次の形式で追加します。画像とアフィリエイトURLは省略または `null` にできます。Amazon・楽天のURLは `affiliateLinks` に分けて登録します。

```json
{
  "devices": [
    {
      "type": "マウス",
      "manufacturer": "メーカー名",
      "productName": "製品名",
      "image": null,
      "sourceUrl": "https://example.com/source",
      "lastVerifiedAt": "2026-10-22",
      "affiliateLinks": {
        "amazon": null,
        "rakuten": null
      }
    }
  ]
}
```

既存の汎用フィールド `affiliateUrl` も引き続き利用できます。商品リンクを登録すると、プロフィールページに広告（PR）であることが明示されます。確認できていない製品やリンクは登録しないでください。

## コマンド

```sh
# 開発サーバーをバックグラウンドで起動
npm run astro -- dev --background

# 状態・ログの確認と停止
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop

# 本番ビルド
npm run build

# Cloudflare用の型を生成
npm run generate-types
```

## SEO設定

サイトURLと検索エンジンへのインデックス許可は、ルートの `site.config.mjs` で管理します。

- `url`: canonical、OGP、サイトマップ、robots.txtで共通利用するサイトURL
- `indexingEnabled`: 正式公開前は `false`。公開準備が整った時点で `true` に変更
- `contactEmail`: 問い合わせ先。未決定の場合は `null`
- `services`: アクセス解析、ディスプレイ広告、アフィリエイトの導入状況

`contactEmail` は決定後に実値へ変更してください。`services` は未導入中は `null` または空配列のままにし、実際に導入したサービス名だけを設定します。固定ページの案内文は、この設定に応じて未導入・導入済みの表示を切り替えます。

独自ドメイン決定後は `url` を変更し、公開内容を確認してから `indexingEnabled` を `true` にしてください。プレビュー・テスト用のパスは同じ設定ファイルの `sitemapExcludedPathPrefixes` でサイトマップから除外され、共通レイアウトでも自動的に `noindex` になります。

Cloudflare Workersの設定は `astro.config.mjs` と `wrangler.jsonc` で管理しています。
