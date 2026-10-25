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

### プロフィール画像

プロフィール画像は、権利者の許可や明示された利用条件を確認できた場合だけ登録します。公式サイトやSNSに掲載されていること自体は転載許可を意味しません。未確認の場合は `null` のままにし、画面では名前の頭文字を表示します。

```json
{
  "profileImage": {
    "src": "/images/streamers/example.webp",
    "alt": "配信者名のプロフィール画像",
    "sourceUrl": "https://example.com/official-profile",
    "permissionStatus": "confirmed",
    "permissionNote": "権利者からWebサイト掲載許可を取得",
    "credit": "撮影者名 / 権利者名",
    "lastVerifiedAt": "2026-10-25"
  }
}
```

- `src`: `https://` で始まる画像URL、または `public/` を基準に `/` で始まる画像パス
- `sourceUrl`: 画像の取得元ページ
- `permissionStatus`: `confirmed`、`unconfirmed`、`not-permitted` のいずれか。画面に表示されるのは `confirmed` だけ
- `permissionNote`: 許可・ライセンス・利用条件を確認した根拠
- `credit`: 必要なクレジット。不要な場合は省略または `null`
- `lastVerifiedAt`: 利用条件を最後に確認した日

ローカル画像を保存する場合は、元画像を無断でダウンロードせず、許可されたファイルだけを `public/images/streamers/` に配置してください。

### 使用デバイス

`devices` は任意です。確認できたデバイスだけを次の形式で追加します。画像は省略または `null` にできます。

```json
{
  "devices": [
    {
      "type": "マウス",
      "manufacturer": "メーカー名",
      "productName": "製品名",
      "image": null,
      "sourceUrl": "https://example.com/source",
      "lastVerifiedAt": "2026-10-22"
    }
  ]
}
```

### アフィリエイト商品リンク

Amazon・楽天の商品リンクは、同じ製品を使用する配信者ごとに重複させず、`src/config/device-affiliate-links.ts` で製品単位に管理します。キーはカテゴリー・メーカー・製品名の完全一致で作るため、型番や世代の異なる製品は別々に登録してください。

登録前に、各プログラムへの参加承認と `streamerage.jp` のサイト登録を済ませ、公式のリンク作成機能から発行されたHTTPS URLだけを使用します。リンクを追加したら、`site.config.mjs` の `services.affiliatePrograms` と `/disclosure/` の表示が実態に合うことも確認してください。

広告サービスから改変禁止のHTMLタグや画像素材が発行された場合は、URLだけを抜き出して登録せず、そのサービスの利用条件に従って別途実装を確認してください。価格や商品画像を手動転載せず、提供元が認めるリンク作成機能やAPIだけを使用します。

商品リンクがある場合だけ、プロフィールと `/devices/` に購入ボタンおよび広告（PR）表記が表示されます。使用情報の出典リンクとは分離され、外部リンクには `rel="sponsored nofollow noopener noreferrer"` が設定されます。既存JSONの `affiliateLinks` と `affiliateUrl` は後方互換のため読み取れますが、新規登録は中央設定を使用してください。

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

正式URLは `https://streamerage.jp/` です。公開内容を確認し、検索エンジンへの登録を開始する段階になってから `indexingEnabled` を `true` にしてください。プレビュー・テスト用のパスは同じ設定ファイルの `sitemapExcludedPathPrefixes` でサイトマップから除外され、共通レイアウトでも自動的に `noindex` になります。

Cloudflare Workersの設定は `astro.config.mjs` と `wrangler.jsonc` で管理しています。
