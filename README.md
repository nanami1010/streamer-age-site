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
   生年が確認できず月日だけ確認できた場合は、`birthDate: null` のまま `birthMonthDay` を `MM-DD` 形式で記載します。2月29日にも対応しています。
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
  "birthMonthDay": "10-31",
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

`birthDate` が登録済みの場合、`birthMonthDay` は記載しません。月日の出典は `sources` に `field: "birthMonthDay"` として登録します。`birthMonthDay` だけでは年齢や生まれた年度を計算しません。

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
    "lastVerifiedAt": "2026-10-25",
    "usageScopes": ["homeCard", "profilePage", "generationCard"]
  }
}
```

- `src`: `https://` で始まる画像URL、または `public/` を基準に `/` で始まる画像パス
- `sourceUrl`: 画像の取得元ページ
- `permissionStatus`: `confirmed`、`unconfirmed`、`not-permitted` のいずれか。画面に表示されるのは `confirmed` だけ
- `permissionNote`: 許可・ライセンス・利用条件を確認した根拠
- `credit`: 必要なクレジット。不要な場合は省略または `null`
- `lastVerifiedAt`: 利用条件を最後に確認した日
- `usageScopes`: 許可された表示用途。次の値だけを指定できます
  - `homeCard`: トップページの配信者カード
  - `profilePage`: 配信者プロフィールページ
  - `generationCard`: 年度別配信者カード
  - `ogp`: プロフィールページのOGP画像

`permissionStatus` が `confirmed` で、表示先が `usageScopes` に含まれる場合だけ画像が表示されます。OGPはWebページ内の表示とは別用途なので、権利者または利用条件がOGP利用を明示的に許可している場合だけ `ogp` を追加してください。`usageScopes` がない既存データは後方互換のため3つのページ内表示だけを許可し、OGPには使用しません。新しく登録する画像では必ず `usageScopes` を指定してください。

#### 許可済み画像の登録手順

1. 本人・権利者からの許可、またはプレスキット等の利用条件で、対象用途、商用サイトでの掲載可否、加工可否、クレジット要否を確認します。
2. 許可メールや利用条件の記録は、個人情報や非公開情報をGitへ入れず、運営者だけがアクセスできる保管先に保存します。JSONの `sourceUrl`、`permissionNote`、`lastVerifiedAt` には、公開可能な根拠URL、許可内容の要約、確認日を記録します。
3. ローカル配信が許可されている画像だけを `public/images/streamers/<slug>.<拡張子>` に配置します。外部画像の無断ダウンロードや、許可されていない切り抜き・変換は行いません。
4. `src`、内容を説明する `alt`、必要な `credit`、許可された `usageScopes` を設定します。
5. `sources` に `{ "field": "profileImage", "url": "根拠URL" }` を追加します。
6. `npm run build` と `npm run test` を実行し、許可した画面だけに表示され、未許可の画面とOGPでは頭文字またはメタ画像なしへフォールバックすることを確認します。

#### 利用許可が撤回された場合

1. 対象JSONの `profileImage` を直ちに `null` にします。確認中の場合は一時的に `permissionStatus` を `unconfirmed` にしても、すべての用途で非表示になります。
2. `rg` などで参照が残っていないことを確認してから、許可が撤回されたローカル画像を `public/images/streamers/` から削除します。
3. 再ビルドし、トップ、プロフィール、年度別カード、OGPのすべてから画像が消え、頭文字表示へ戻ることを確認します。
4. CDNや外部キャッシュの削除が必要な場合は、各サービスの手順に従います。

画像が未登録、未確認、利用不可、または対象用途が許可されていない場合は、ページ内では名前の頭文字を表示します。OGPでは `og:image` と `twitter:image` を出力せず、既存のテキスト情報だけを使用します。

### 使用デバイス

`devices` は任意です。確認できたデバイスだけを次の形式で追加します。画像は省略または `null` にできます。

```json
{
  "devices": [
    {
      "productId": "razer-deathadder-v3-pro",
      "type": "マウス",
      "manufacturer": "Razer",
      "productName": "DeathAdder V3 Pro",
      "image": null,
      "sourceUrl": "https://example.com/source",
      "sourceType": "directStatement",
      "usageConfirmedAt": "2026-10-22",
      "lastVerifiedAt": "2026-10-22"
    }
  ]
}
```

`sourceType` は出典の性質に合わせて次から選びます。

- `directStatement`: 本人の直接発言・動画
- `ownedDeviceList`: 本人管理サイトのデバイス一覧
- `channelCommand`: 公式配信チャンネルに紐づく公開コマンド
- `officialMaterial`: その他の公式資料

`usageConfirmedAt` は、資料から実際の使用時点を確認できる場合だけ `YYYY-MM-DD` で登録します。公開コマンドの最終更新日時を使用日として登録してはいけません。Nightbotなどの公開コマンドでは `usageConfirmedAt` を省略し、確認したコマンド名を `sourceCommand`、APIが返した更新日時を `sourceUpdatedAt` にISO 8601形式のまま登録してください。`lastVerifiedAt` はSTREAMER AGEが出典を確認した日です。

```json
{
  "sourceUrl": "https://nightbot.tv/t/example/commands",
  "sourceType": "channelCommand",
  "sourceCommand": "!mouse",
  "sourceUpdatedAt": "2026-10-22T12:34:56.789Z",
  "lastVerifiedAt": "2026-10-26"
}
```

製品名や型番に未解決事項がある場合は、断定を避けて `verificationNote` に確認状況を記録します。

`productId` は `src/config/device-products.ts` の製品台帳で管理する、表示名から独立した永続IDです。同じ製品を複数人へ登録するときは同じIDを使用し、型番・世代・バリエーションが違う製品には別のIDを割り当てます。表示上のメーカー名や製品名を変更しても、既存の `productId` は変更しません。

製品台帳には、必要に応じて `commerceIdentifiers` として型番、JAN、ASIN、楽天の商品コードを保持できます。公式資料や実際の商品ページで確認できた値だけを追加し、不明な識別子は省略してください。JANは8桁または13桁、ASINは10桁の半角英大文字・数字として検証されます。`identityStatus: "needs-review"` の製品へ購入リンクを設定すると検証エラーになるため、同一性を解決してから `confirmed` に変更します。

### アフィリエイト商品リンク

商品リンクは、同じ製品を使用する配信者ごとに重複させず、`src/config/device-affiliate-links.ts` で `productId` 単位に管理します。配信者JSONへアフィリエイトURLを直接登録してはいけません。

Amazonは、参加承認と `streamerage.jp` のサイト登録後、アソシエイト・ツールバーまたはモバイル・ゲットリンクから正式発行されたリンクだけを登録します。設定には発行元も記録し、HTTPS、許可ホスト、通常URLのアソシエイトタグを検証します。リンクを追加したら、`site.config.mjs` の `services.affiliatePrograms` と `/disclosure/` の表示が実態に合うことも確認してください。

楽天は、発行HTMLの実物と利用条件を確認するまでランタイム設定と表示を未実装にしています。発行HTMLからURLだけを抜き出して独自の `a` タグへ転記したり、属性を追加・削除したりしてはいけません。実物を取得後、改変せず掲載する方式または楽天が明示的に認める方式を決定してから実装します。

Amazon商品リンクがある場合だけ、プロフィールと `/devices/` に購入ボタンおよび広告（PR）表記が表示されます。使用情報の出典リンクとは分離され、外部リンクには `rel="sponsored nofollow noopener noreferrer"` が設定されます。価格や商品画像を手動転載せず、提供元が認めるリンク作成機能やAPIだけを使用します。

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
