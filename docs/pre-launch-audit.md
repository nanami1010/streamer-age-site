# STREAMER AGE 正式公開前総合監査

- 監査日: 2026-10-27（Asia/Tokyo）
- 対象: ローカル `main` ブランチの未コミット変更を含む作業ツリー
- 方針: コード・配信者データ・デバイスデータは変更せず、監査結果のみを記録
- 総合判定: **正式公開は条件付き保留（出典・404の指摘は解消）**

ビルド、209件の自動テスト、100人のプロフィール生成、40製品・49掲載記録の整合性、主要画面のレスポンシブ表示には重大な障害が見つからなかった。赤髪のとも・蛇足の誕生日出典は本人公式YouTubeで確認し、日本語404ページも追加した。一方、作業ツリーが未コミットのままであることと、Cloudflare管理画面側の本番設定をローカルから確定できないことは公開前に解消または確認する必要がある。

## 1. 現在の完成状況

| 項目 | 状況 |
| --- | --- |
| 配信者 | 100人。完全な生年月日68人、月日のみ29人、誕生日未確認3人 |
| プロフィール | 100ページを静的生成。全ページをChromiumで検証済み |
| 年度ページ | 年度一覧1ページ、登録者がいる年度25ページを生成 |
| デバイス | 40製品・49掲載記録・13人。`productId`で製品を識別 |
| 画像 | 登録0件。頭文字フォールバックを使用 |
| アフィリエイト | Amazon・楽天とも本番リンク0件。購入ボタンとPR表記は非表示 |
| 問い合わせ | 入力検証、Turnstile、Rate Limiter、Email Sendingの実装あり。実運用設定はCloudflare管理画面で要確認 |
| SEO | 正式ドメインに統一。全132 HTML（404を含む）が `noindex, follow` |
| 公開状態 | `indexingEnabled: false`。正式公開用のインデックス許可は未実施 |

## 2. 問題なく動作している機能

- トップページに100件のカードが表示される。
- 名前・読み・別名、ジャンル、年齢帯、生まれた年度のAND検索、0件表示、リセットが動作する。
- 完全な生年月日、月日のみ、誕生日未確認の3状態を区別し、生年不明者の年齢や年度を推測しない。
- 100人のプロフィールで登録内容、SNS、誕生日、年齢、年度、出典、デバイス表示がデータと一致する。
- 年度一覧および25年度分の同学年ページがデータから生成され、生年不明者は混入しない。
- `/devices/` は49件を40製品に集約し、同一製品の複数使用者と型番・世代違いを区別する。
- Nightbot由来37件では、コマンド更新日時を使用確認日とせず、出典種別・更新日・サイト確認日を分離して表示する。
- 問い合わせフォームは必須条件、URL、文字数、Turnstile、回数制限、送信失敗をサーバー側で扱う。
- プライバシー、問い合わせ、広告・免責の固定ページが生成される。
- 生成済み132 HTMLから参照される内部リンク1,234件を照合し、欠落ページは0件だった。
- 320px、375px、768px、1280pxでトップ、代表プロフィール、問い合わせに横スクロールがなく、デバイス一覧も375px・1280pxで正常だった。
- 存在しないURLはHTTP 404を維持したまま、日本語の専用ページを表示する。

## 3. 正式公開前に修正・確認が必須の項目

### A1. 未コミット変更をレビュー可能な単位で確定する

現在の `main` は `origin/main` より5コミット先行し、さらに25個の追跡ファイル変更と5個の未追跡ファイルがある。ステージ済みファイルはない。現在の未コミット変更は製品ID移行、デバイス拡充、アフィリエイト基盤、404、テスト、文書が相互依存しているため、少なくとも次の単位で内容をレビューする。

1. デバイス出典・49掲載記録への拡充
2. 40製品の `productId` 台帳とAmazon/Rakuten表示基盤
3. テスト更新
4. 監査文書

`productId`を含むJSON、スキーマ、製品台帳、カタログ生成は同じコミットで整合させる必要がある。無理に分割するとビルド不能になる可能性がある。

### 対応済み: 誕生日出典2件

- 赤髪のとも: 既存の本人公式YouTube動画「赤髪のとも のお誕生日会場in2025」を確認した。2025年7月23日21時に配信開始され、概要欄にも「楽しい誕生日を迎えられそうです」とあるため、登録値 `07-23` の根拠として妥当。既存JSONの出典URLは変更していない。
- 蛇足: Xは外部取得で403となったが、本人公式YouTubeチャンネル「蛇足ん家」の「本日49歳に【成った】男の配信」を確認できた。日本時間2026年3月2日の本人配信として登録値 `03-02` を裏付けられるため、出典URLのみ本人YouTubeへ変更した。

両者とも生年は登録しておらず、月日のみの状態を維持している。

### A2. Cloudflare管理画面の本番設定を確認する

ローカル設定だけでは、次を確定できない。

- `main` push時にCloudflare Workers Buildsが起動するGitHub連携の実状態
- Build commandが `npm run build`、Deploy commandが `npx wrangler versions upload` のままであること
- `streamerage.jp`のCustom Domainと現行Production versionの紐付き
- Runtime Secrets `CONTACT_TO_EMAIL`、`CONTACT_FROM_EMAIL`、`TURNSTILE_SECRET_KEY`、`CONTACT_FORM_ENABLED`
- Build variables `PUBLIC_CONTACT_FORM_ENABLED`、`PUBLIC_TURNSTILE_SITE_KEY`
- Turnstile widgetの許可ホストに `streamerage.jp` があること
- `CONTACT_EMAIL` Email Sending bindingの認証済み宛先
- `CONTACT_RATE_LIMITER` binding、Astroが要求する `SESSION` KV、`IMAGES` bindingの本番環境での存在

現在のDeploy commandはProductionへの直接デプロイではなくVersion uploadを意図したものだが、GitHub連携のトリガーとPromote/traffic assignmentの設定は管理画面で最終確認する。確認前にpushしない。

参考:

- [Wrangler commands](https://developers.cloudflare.com/workers/wrangler/commands/)
- [Gradual deployments](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/gradual-deployments/)
- [Turnstile hostname management](https://developers.cloudflare.com/turnstile/additional-configuration/hostname-management/)
- [Send emails from Workers](https://developers.cloudflare.com/email-routing/email-workers/send-email-workers/)

### A3. 公開操作時だけインデックス設定を切り替える

現状は意図どおり全HTMLが `noindex, follow` で、robots.txtはクロールを許可している。正式公開の最終承認後に限り `indexingEnabled: true` へ変更し、再ビルドして `index, follow`、canonical、sitemapを確認する。今回の監査では変更していない。

## 4. 公開後の改善でもよい項目

### 対応済み: 独自404ページ

`src/pages/404.astro`を追加し、STREAMER AGEの共通ヘッダー・フッター、トップへのリンク、配信者検索への導線を表示する。未知URLのHTTP 404、`noindex, follow`、サイトマップ除外を維持し、320px・375px・768px・1280pxで横スクロールがないことをChromiumで確認した。

### B1. 構造化データ

JSON-LDなどの構造化データは未実装。現状のtitle、description、canonical、OGP、サイトマップは整っているため公開阻害ではない。人物・WebSite・Breadcrumbなどは、Googleの対象仕様と公開データの意味を確認して後から導入する。

### B2. 外部出典の継続監視

今回404は0件だったが、所属サイト、SNS、YouTube、PDFなど外部URLは変化する。定期的なHTTP・本文監査を自動化し、403/429をリンク切れと誤判定しない仕組みが望ましい。

### B3. プロフィール画像

画像0件でもUIは破綻しない。許諾済み画像だけを段階的に追加すればよく、公開条件ではない。

## 5. Gitの未コミット変更一覧

### 5.1 状態

- `git diff --stat`: 25ファイル、518 insertions、184 deletions（未追跡ファイルを除く）
- `git diff --cached --stat`: 変更なし
- 直近5コミット:
  - `fe3f9dc Expand streamer database and improve device source tracking`
  - `edc26d3 Complete 100 streamer profiles and birthday support`
  - `06181f5 Expand streamer data and support birthday-only profiles`
  - `73f8c82 Add 20 streamers and refine profile image usage`
  - `0e20f1e Add profile image and affiliate support`

### 5.2 コミット対象候補

| 分類 | ファイル |
| --- | --- |
| 製品ID・スキーマ | `src/content.config.ts`, `src/config/device-products.ts`, `src/lib/device-catalog.ts` |
| アフィリエイト基盤 | `src/config/device-affiliate-links.ts`, `src/components/DeviceList.astro`, `src/pages/devices/index.astro` |
| デバイス掲載記録 | `src/data/streamers/1tappy.json`, `cpt.json`, `dep.json`, `francisco.json`, `k4sen.json`, `laz.json`, `ras.json`, `shaka.json`, `shomaru7.json`, `spygea.json`, `suzuki-noriaki.json`, `ta1yo.json`, `vodka.json` |
| 誕生日出典 | `src/data/streamers/dasoku.json` |
| 404 | `src/pages/404.astro`, `site.config.mjs` |
| テスト | `tests/device-catalog.test.mjs`, `tests/seo.test.mjs`, `tests/e2e/devices.spec.ts`, `tests/e2e/not-found.spec.ts`, `tests/e2e/profiles.spec.ts` |
| 文書 | `README.md`, `docs/affiliate-readiness.md`, `docs/pre-launch-audit.md` |

未追跡ファイルは `docs/affiliate-readiness.md`、`docs/pre-launch-audit.md`、`src/config/device-products.ts`、`src/pages/404.astro`、`tests/e2e/not-found.spec.ts` の5件。いずれも過去または今回の工程で意図して作成された成果物であり、コミット対象候補である。

### 5.3 コミットしてはいけないもの

以下は生成物・ローカル設定であり、現在 `.gitignore` の対象である。

- `node_modules/`
- `dist/`
- `.astro/`
- `.wrangler/`
- `playwright-report/`
- `test-results/`
- `debug.log`
- `.env`, `.env.production`, `.dev.vars`, `.dev.vars.*`

`git status --short`には秘密鍵、トークン、認証情報、`.env`、ビルド生成物は現れていない。Secretの実値を含むファイルもコミット候補にはない。

## 6. SEO・公開設定

### 6.1 確認結果

- `site.config.mjs`の正式URLは `https://streamerage.jp/`。
- `indexingEnabled`は `false`。
- 132 HTMLすべてにtitle、meta description、canonical、OGP title/description/url、Twitter Card、`noindex, follow`が1件ずつ存在する。
- canonical、OGP URL、sitemapのURLはwwwなしの `https://streamerage.jp/` に統一されている。
- `workers.dev`の参照は生成SEO出力に0件。
- robots.txtは `User-agent: *` / `Allow: /` で、HTMLのnoindexを読める設定。
- robots.txtのSitemapは `https://streamerage.jp/sitemap-index.xml`。
- sitemapは131 URL、うちプロフィール100 URL。APIと404は含まれない。
- OGP画像は設定されていない。許可のないプロフィール画像を代用していない。
- JSON-LD/Schema.org構造化データはない。

### 6.2 正式公開時のチェックリスト

1. CloudflareのVersion URLで最終確認する。
2. Custom DomainとProduction versionの対応を確認する。
3. `indexingEnabled: true`へ変更する専用コミットを作る。
4. 再ビルド後、robots metaが `index, follow`、robots.txtがクロール許可のまま、sitemap/canonicalが正式ドメインであることを確認する。
5. ProductionへPromote後、実ドメインで同じ内容を確認する。
6. 必要に応じてSearch Consoleへサイトマップを送信する。

## 7. 出典URLの監査

### 7.1 集計

| 区分 | 人数 | 結果 |
| --- | ---: | --- |
| 完全な生年月日 | 68 | 年齢・年度の基準として登録 |
| 月日のみ | 29 | 年齢・年度を算出しない |
| 誕生日未確認 | 3 | 布団ちゃん、おにや、ボドカ |
| 誕生日出典あり | 97 | 94個の一意URL |
| 本文で登録値を確認 | 97 | PDF、HTML、本人動画、アクセス制限ページの目視確認を含む |
| 本文で再確認が必要 | 0 | 今回の対応で解消 |
| HTTP 404 | 0 | 監査時点 |
| 直接取得で403 | 2 | ひぐち、レトルト。ブラウザ相当の取得では本文確認済み |

### 7.2 ZETA DIVISION重点確認

過去にメンテナンス・404が報告された次の8件は、2026-10-27時点で公式本文を開き、登録日と一致する記載を確認できた。

| 配信者 | 登録値 | 監査した公式出典 | 結果 |
| --- | --- | --- | --- |
| crow | 1997-11-28 | [公式プロフィール](https://zetadivision.com/players/crow?PageSpeed=noscript) | 本文一致 |
| JapaneseKoreanUG | 1993-07-01 | [公式プロフィール](https://zetadivision.com/players/japanesekoreanug) | 本文一致 |
| k4sen | 1991-09-15 | [公式記事](https://zetadivision.com/news/2021/09/23/6359?PageSpeed=noscript) | 本文一致 |
| Laz | 1995-11-26 | [公式プロフィール](https://zetadivision.com/players/laz) | 本文一致 |
| SHAKA | 1991-12-27 | [公式プロフィール](https://zetadivision.com/players/shaka) | 本文一致 |
| 鈴木ノリアキ | 1996-07-16 | [公式プロフィール](https://zetadivision.com/players/%E9%88%B4%E6%9C%A8%E3%83%8E%E3%83%AA%E3%82%A2%E3%82%AD) | 本文一致 |
| ta1yo | 2000-04-12 | [公式プロフィール](https://zetadivision.com/players/ta1yo?PageSpeed=noscript) | 本文一致 |
| 焼きパン | 2000-08-01 | [公式プロフィール](https://zetadivision.com/players/%E7%84%BC%E3%81%8D%E3%83%91%E3%83%B3) | 本文一致 |

### 7.3 手動確認を要したが一致した出典

- Bonchan、sako、ときど: KADOKAWAの公式PDF本文で年月日を確認。
- cosa: 再春館システム公式HTMLで `1993 / 6 / 24` を確認。
- 狩野英孝: マセキ芸能社公式プロフィールで `1982年2月22日` を確認。
- ひぐち: 直接HTTP取得は403/CAPTCHAだったが、再春館システム公式ページ本文で `2001/9/14` を確認。リンク切れではない。
- レトルト: 直接HTTP取得は403だったが、参照ページ本文で12月26日を確認。ただし出典は第三者記事で、本人・所属の一次資料ではない。

### 7.4 前回の再確認対象への対応

| 配信者 | 登録値 | 出典 | 問題 |
| --- | --- | --- | --- |
| 赤髪のとも | 07-23 | [本人YouTube](https://www.youtube.com/watch?v=o38ae2zt8EU) | 7月23日開始の誕生日配信と概要欄を確認。既存出典を維持 |
| 蛇足 | 03-02 | [本人YouTube](https://www.youtube.com/watch?v=kb5WCUXifs0) | 「本日49歳に【成った】男の配信」を確認。X出典から差し替え |

### 7.5 残る95人の状況

誕生日未確認3人を除く97人は、登録値を出典本文または本人公式動画で照合できた。所属公式、本人公式、公式インタビュー等を優先しているが、一部に第三者メディアが含まれる。外部URLは変化し得るため、この結果は監査日のスナップショットとして扱う。

## 8. デバイス・アフィリエイト監査

### 8.1 製品と掲載記録

- 製品台帳: 40製品、`productId`重複0件。
- 掲載記録: 49件、未解決の`productId`参照0件。
- 参照されていない製品台帳0件。
- 全40製品が少なくとも1件の掲載記録から参照される。
- デバイス情報がある配信者は13人、ない配信者は87人。
- 出典種別: `channelCommand` 37件、`directStatement` 7件、`ownedDeviceList` 5件、`officialMaterial` 0件。
- Nightbot由来37件には推測した `usageConfirmedAt` がなく、`sourceUpdatedAt`と`lastVerifiedAt`を分離している。

### 8.2 同一性が要確認の12製品

次は `identityStatus: needs-review` であり、Amazonリンクを登録できない設計になっている。

1. `sony-inzone-m10s-sdm-27q10s`
2. `bose-quietcomfort-20`
3. `sony-inzone-h5-wh-g500`
4. `vspo-kisaragi-ren-keyboard`
5. `sony-inzone-buds-wf-g700n`
6. `steelseries-apex-pro-tkl-jp`
7. `shure-se846-clear`
8. `lethal-gaming-gear-saturn-pro`
9. `logicool-pro-x-gaming-keyboard`
10. `artisan-99-shiki-matcha`
11. `endgame-gear-op1-wired`
12. `artisan-ninja-fx-zero-soft`

### 8.3 過去のA分類12製品との照合

販売状況監査でA分類だった12製品のうち、現行の製品同一性チェックも通る即時候補は11製品。`Sony INZONE H5 / WH-G500`のみ `needs-review` のため保留する。

Amazonリンク登録の技術的優先候補:

1. Apple EarPods with 3.5mm Headphone Plug
2. Razer DeathAdder V3 Pro
3. Pulsar PCMK 3 HE 60%
4. Logicool G PRO X SUPERLIGHT Magenta
5. Razer Viper V3 Pro Faker Edition
6. Sony INZONE M10S II / SDM-27Q102
7. BenQ ZOWIE XL2566X+
8. Sony INZONE E9
9. Logicool G PRO X SUPERLIGHT 2 White
10. Audio-Technica AT2035
11. Shure SM7dB

これは「リンクを今すぐ登録してよい」という意味ではない。Amazon Associatesで正式発行したURL、タグ、商品同一性、販売ページを登録時に再確認する。

### 8.4 表示と規約対応

- Amazonリンク設定は `productId`キーで管理され、表示名変更で紐付けが外れない。
- URLはHTTPS、許可ホスト、Associate tagを検証する。
- `identityStatus: needs-review`にはリンクを設定できない。
- リンク0件の現状では購入ボタンとPR表示を出さない。
- Amazonリンクが存在する場合のみ、使用根拠と分離した購入導線、PR表示、`rel="sponsored nofollow noopener noreferrer"`を出す。
- 楽天は `pending-issued-code-review` で、ランタイム表示も独自ボタンも未実装。実際の発行HTMLを確認するまでURL抜き出し方式を採用しない。
- `/disclosure/`は未提携のサービスを利用中と誤認させない内容。

Amazonの許可URL形式、短縮URL、タグ要件は実リンク発行時に最新のAssociates管理画面・規約で再確認する。楽天の発行HTMLは属性・URLを独自変更せず、実物を受領してから掲載方式を確定する。

参考:

- [Amazon Associates Program Policies](https://affiliate.amazon.co.jp/help/operating/policies)
- [楽天アフィリエイト ガイドライン](https://affiliate.rakuten.co.jp/guideline/rule/)

## 9. プロフィール画像の状況

- 100人すべて `profileImage: null`。無許可画像は含まれない。
- トップ、プロフィール、年度カードは頭文字フォールバックを表示し、自動テストで確認済み。
- スキーマは利用許可状態、取得元、確認日、クレジット、`usageScopes`を管理できる。
- `usageScopes`未指定の既存画像は画面表示との後方互換性を保つ一方、OGPには使わない。
- OGPは、利用許可確認済みかつ `ogp`用途が明示された画像だけを使用する。
- 現状はOGP画像なしで、安全なフォールバック動作になっている。

画像0件のまま公開してもカード、プロフィール、年度ページのレイアウトは破綻しない。

## 10. Cloudflare公開手順の確認結果

### 10.1 ローカルで確認できた構成

- `astro.config.mjs`: Cloudflare adapterとsitemapを使用。
- `wrangler.jsonc`:
  - Worker名 `streamer-age-site`
  - Assets `./dist` / binding `ASSETS`
  - Email binding `CONTACT_EMAIL`
  - Rate Limiter `CONTACT_RATE_LIMITER`、3 requests / 60 seconds
  - Observability enabled
  - Custom Domainやroutesの直書きなし
- ビルド時にCloudflare Imagesの `IMAGES` binding、sessions用 `SESSION` KVが案内される。
- package.jsonにdeployスクリプトはない。
- `.github/workflows`は存在しない。
- READMEはCloudflare設定とSecretの考え方を説明するが、本番Promote手順を自動化していない。

### 10.2 推定できること／できないこと

- リポジトリ内にGitHub Actionsの自動デプロイはない。
- ユーザー確認済みのCloudflare Workers Builds設定が `npm run build` + `npx wrangler versions upload` であれば、pushでビルドとVersion uploadが起きる可能性がある。
- `versions upload`は新しいVersionを作る方式であり、通常はPromote/traffic assignmentが別操作になる。ただしCloudflare管理画面の実際のBuild hook、branch filter、production設定はローカルから確認できない。
- 現在のProduction version、独自ドメイン接続、Secretsの値、認証済み宛先、Turnstile hostnameは管理画面でのみ確認可能。

### 10.3 推奨公開手順

1. 未コミット変更をレビューし、秘密情報がないことを再確認する。
2. 論理的なコミットを作り、各コミットでbuild/testを通す。
3. Cloudflare管理画面でBuild/Deploy command、Production branch、Secrets、Bindingsを確認する。
4. pushによって本番トラフィックが変わらずVersion uploadだけになることを確認する。
5. 生成されたVersion URLでトップ、検索、代表プロフィール、年度、デバイス、問い合わせ失敗系を確認する。
6. 問い合わせを有効にする場合は、Turnstile許可ホストとEmail Routingの認証済み宛先を確認し、実メールを1件だけ検証する。
7. 正式公開承認後にnoindex解除用コミットを作る。
8. 対象VersionをProductionへPromoteし、`https://streamerage.jp/`で最終確認する。

## 11. 総合テスト結果

| 検証 | 結果 |
| --- | --- |
| `npm run build` | 成功。100プロフィール、25年度詳細、固定ページ、sitemapを生成 |
| `npm run test` 単体 | 29/29成功 |
| `npm run test` Playwright Chromium | 180/180成功 |
| 合計 | 209/209成功 |
| `git diff --check` | 成功（空出力） |
| 生成HTML SEO監査 | 132/132問題なし。404はサイトマップから除外 |
| 内部リンク監査 | 1,234件、欠落0件 |
| レスポンシブ | 320/375/768/1280pxの既存テスト成功 |
| 404 | HTTP 404、日本語表示、検索導線、noindex、4画面幅を確認 |

前回監査時の初回 `npm run test` は、別途起動していたAstroバックグラウンドサーバーとの競合でPlaywright開始前に停止した。今回の対応後は競合なく実行し、209件すべて成功した。

## 12. 正式公開してよいかの判定

**現時点では公開操作を行わず、条件付き保留とする。**

アプリケーション本体は100人規模で正常に動作し、SEO URL、noindex、データ構造、デバイス表示、問い合わせの防御的実装も概ね整っている。公開前に次を完了すれば、技術面では公開可能と判断できる。

1. 未コミット変更のレビューとコミット整理
2. Cloudflare管理画面でBuild/Deploy、Custom Domain、Secrets、Bindings、Turnstile、Emailの確認
3. Version URLでの最終確認
4. 公開承認時だけnoindexを解除し、再テスト

独自404ページと誕生日出典2件の指摘は解消した。構造化データは公開後の品質改善としてよい。Amazon/Rakutenリンクは0件のままでも虚偽表示がなく、サイト公開自体を妨げない。
