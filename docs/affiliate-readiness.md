# STREAMER AGE アフィリエイト導入前監査

- 調査日: 2026-10-27（日本時間）
- 対象: 登録済み 40 製品 / 49 件の使用・掲載記録
- 対象サービス: Amazon.co.jp、楽天市場
- 現在の状態: Amazon・楽天の購入リンクは 0 件。`indexingEnabled: false` のまま。
- 技術基盤更新: STEP 28-19で安定した`productId`とAmazon専用設定へ移行。楽天表示は発行コード確認まで無効。

## このレポートの読み方

販売状況は調査日時点のスナップショットであり、在庫や出品者は変動する。検索結果に製品名が出ただけでは新品販売中と判定せず、可能な限り商品ページまたはショップの商品一覧まで確認した。Amazon.co.jp はこの調査環境から個別商品ページを安定して取得できないものが多かったため、その場合は「未確認」または「間接確認」とした。マーケットプレイス出品は、正規販売・新品・真正品を保証するものではない。

記号:

- `○`: 型番または明確な製品名が一致する新品掲載を商品ページ/商品一覧で確認
- `△`: 製品の掲載は確認できたが、在庫、出品状態、型番、世代、色などに未確認事項がある
- `—`: 同一商品の新品掲載を直接確認できず

分類:

- **A**: 製品同一性が明確で、少なくとも一方の販売先で新品掲載を確認
- **B**: 製品同一性は明確だが、直販・専門店中心、または販売先が限定的
- **C**: 旧モデル・限定色・廃番等で新品販売の継続確認が難しい
- **D**: 型番、世代、バリエーション、または使用根拠の再確認が必要

## 監査結果の概要

| 分類 | 製品数 | 判断 |
| --- | ---: | --- |
| A | 12 | 現時点の収益化候補。リンク作成時に商品ページを再確認する |
| B | 8 | 直販・専門店・限定流通を優先し、Amazon/楽天への無理な誘導はしない |
| C | 9 | 後継機へ置換せず、同一旧モデルの新品がある場合だけリンクする |
| D | 11 | 購入リンクを設定せず、先に型番・世代・根拠を解決する |

したがって、現時点で実際に収益化対象として有望なのは **A の 12 製品**。ただし、Amazon と楽天の両方へリンクできると確認した数ではなく、「どちらかで同一新品の掲載を確認できた」数である。

## 40製品の商品照合

### マウス

| # | 登録製品 / 使用者 | 既存の使用・掲載情報源 | Amazon.co.jp | 楽天市場 | 分類 | 同一性・販売上の注意 |
| ---: | --- | --- | --- | --- | :---: | --- |
| 1 | Finalmouse SLX Nightfall / 1tappy | [公式Twitchに紐づく公開コマンド](https://nightbot.tv/t/1tappytheworld/commands) | — | — | B | 製品名は明確。限定販売・直販中心で、国内モールの同一新品を確認できず |
| 2 | Razer DeathAdder V3 Pro / Cpt、Ras | [Cpt公開コマンド](https://nightbot.tv/t/cr_cpt/commands)、[Ras公開コマンド](https://nightbot.tv/t/ras_sama/commands) | ○（Amazonカテゴリ内の同名新品を確認） | ○（同名新品を確認） | A | 本体世代は明確。色は記録されていないため、色固定の商品へ直接リンクしない |
| 3 | Pulsar X2 CrazyLight Medium / Dep | [公開コマンド](https://nightbot.tv/t/dep_ow/commands) | — | △ | B | Medium まで明確。色・限定版を固定しない |
| 4 | Logicool G PRO X SUPERLIGHT Magenta / Francisco | [公開コマンド](https://nightbot.tv/t/franciscoow/commands) | △ | △ | A | 初代 SUPERLIGHT の Magenta。SUPERLIGHT 2 や別色へ置換しない。流通縮小に注意 |
| 5 | Razer Viper V3 Pro Faker Edition / k4sen | [本人動画](https://www.youtube.com/watch?v=bmn1il-BCrk&t=165s) | ○（Amazonカテゴリ内で確認） | [○](https://item.rakuten.co.jp/shoptsukumo/c/0000000110/) | A | 通常版 Viper V3 Pro と区別する |
| 6 | VAXEE NP-01S V3 / Laz | [本人管理のデバイス一覧](https://lazvell.com/about-me/my-devices-2026/) | — | △（中古中心） | B | V3 を Wireless 旧版等と混同しない。VAXEE直販を優先して確認 |
| 7 | Logicool G PRO X SUPERLIGHT 2 White / shomaru7 | [公開コマンド](https://nightbot.tv/t/shomaru7/commands) | ○ | △ | A | 第2世代・白を固定。DEX や初代と区別する |
| 8 | Logicool G PRO Wireless Gaming Mouse / SPYGEA | [公開コマンド](https://nightbot.tv/t/spygea/commands) | △ | △ | C | 旧 PRO Wireless。PRO X SUPERLIGHT 系へ置換しない |
| 9 | Endgame Gear OP1（有線） / 鈴木ノリアキ | [公開コマンド](https://nightbot.tv/t/suzukinoriaki/commands) | — | [○（OP1本体）](https://item.rakuten.co.jp/shoptsukumo/1553985011/) | D | 色が未記録。OP1 8K、OP1we等の派生モデルとは別製品 |
| 10 | Logicool G PRO X2 SUPERSTRIKE / ta1yo | [公開コマンド](https://nightbot.tv/t/ta1yo_tv/commands) | — | — | B | 製品名は明確だが新製品で流通確認が限定的。類似する SUPERLIGHT 2 と混同しない |
| 11 | Hitscan Hyperlight / ボドカ | [公開コマンド](https://nightbot.tv/t/vodkavdk/commands) | — | [○](https://item.rakuten.co.jp/kitcut/5316246047/) | B | 色が未記録。色選択可能な親ページ以外へは固定リンクしない |

### キーボード

| # | 登録製品 / 使用者 | 既存の使用・掲載情報源 | Amazon.co.jp | 楽天市場 | 分類 | 同一性・販売上の注意 |
| ---: | --- | --- | --- | --- | :---: | --- |
| 12 | Logicool G PRO K/DA / Francisco | [公開コマンド](https://nightbot.tv/t/franciscoow/commands) | △ | △ | C | 限定コラボ旧モデル。通常版 PRO / PRO X と区別する |
| 13 | VSPO! GEAR ゲーミングキーボード 如月れんモデル / k4sen | [本人動画](https://www.youtube.com/watch?v=bmn1il-BCrk&t=165s) | — | — | D | 初代・Ver.2等の世代が未確定。世代確認までリンク禁止 |
| 14 | ZENAIM 60% / Laz | [本人管理のデバイス一覧](https://lazvell.com/about-me/my-devices-2026/) | — | — | B | 直販中心。通常サイズの ZENAIM KEYBOARD と区別する |
| 15 | Pulsar PCMK 3 HE 60 / Dep | [公開コマンド](https://nightbot.tv/t/dep_ow/commands) | △ | [○](https://item.rakuten.co.jp/pckoubou/c/0000009440/) | A | 60%モデルまで一致。配列・色を商品リンク側で固定しない |
| 16 | SteelSeries Apex Pro TKL（日本語配列） / shomaru7 | [公開コマンド](https://nightbot.tv/t/shomaru7/commands) | △ | [○（2023）](https://item.rakuten.co.jp/steelseries-official/4517832178884/)、[○（Gen 3）](https://item.rakuten.co.jp/kitcut-ps/53581231261/) | D | 登録値だけでは 2023 / Gen 3 を判別不能。日本語配列だけで統合しない |
| 17 | Logicool G PRO X Gaming Keyboard / SPYGEA | [公開コマンド](https://nightbot.tv/t/spygea/commands) | △ | △ | D | 配列・スイッチ・世代が未記録。現行派生モデルと混同しやすい |

### モニター

| # | 登録製品 / 使用者 | 既存の使用・掲載情報源 | Amazon.co.jp | 楽天市場 | 分類 | 同一性・販売上の注意 |
| ---: | --- | --- | --- | --- | :---: | --- |
| 18 | Sony INZONE M10S（SDM-27Q10S） / 1tappy、Dep、k4sen、SHAKA、ta1yo | [1tappy](https://nightbot.tv/t/1tappytheworld/commands)、[Dep](https://nightbot.tv/t/dep_ow/commands)、[k4sen動画](https://www.youtube.com/watch?v=bmn1il-BCrk&t=165s)、[SHAKA動画](https://www.youtube.com/watch?v=gS4lbJ347vM&t=718s)、[ta1yo](https://nightbot.tv/t/ta1yo_tv/commands) | △ | △ | D | 製品自体は現行掲載あり。Nightbotの3件は M10S 表記のみ、SHAKAは型番の目視再確認が必要。SDM-27Q10Sを全5件へ一律適用しない |
| 19 | Sony INZONE M10S II（SDM-27Q102） / k4sen | [本人動画](https://www.youtube.com/watch?v=bmn1il-BCrk&t=165s) | △ | [○](https://item.rakuten.co.jp/shoptsukumo/9442969012/) | A | 初代 M10S / SDM-27Q10S と別製品 |
| 20 | BenQ ZOWIE XL2566X+ / Laz | [本人管理のデバイス一覧](https://lazvell.com/about-me/my-devices-2026/) | △ | [○（メーカー公式店）](https://item.rakuten.co.jp/benq-directshop/c/0000000167/) | A | XL2566K、XL2566X（+なし）と区別する |

### マウスパッド

| # | 登録製品 / 使用者 | 既存の使用・掲載情報源 | Amazon.co.jp | 楽天市場 | 分類 | 同一性・販売上の注意 |
| ---: | --- | --- | --- | --- | :---: | --- |
| 21 | SkyPAD 2.0 / 1tappy | [公開コマンド](https://nightbot.tv/t/1tappytheworld/commands) | — | — | C | 旧世代。3.0やWALLHACK後継品へ置換しない |
| 22 | VAXEE PA Winter22 / Cpt | [公開コマンド](https://nightbot.tv/t/cr_cpt/commands) | — | — | C | 季節限定旧柄。通常PAや別年版と区別する |
| 23 | Logicool G G840 Magenta / Francisco | [公開コマンド](https://nightbot.tv/t/franciscoow/commands) | △ | △ | C | 限定色。通常の黒や別コラボ柄へ置換しない |
| 24 | VAXEE PD155+ / Laz | [本人管理のデバイス一覧](https://lazvell.com/about-me/my-devices-2026/) | — | — | B | 直販中心。PD と PD155+ を区別する |
| 25 | SkyPAD 3.0 XL / shomaru7 | [公開コマンド](https://nightbot.tv/t/shomaru7/commands) | △ | △ | C | 旧世代。サイズ XL を維持し、WALLHACK後継品へ置換しない |
| 26 | Lethal Gaming Gear Saturn Pro / SPYGEA | [公開コマンド](https://nightbot.tv/t/spygea/commands) | △ | △ | D | サイズ、硬さ、世代が未記録。バリエーション別商品へのリンクは危険 |
| 27 | ARTISAN 99式 抹茶 / 鈴木ノリアキ | [公開コマンド](https://nightbot.tv/t/suzukinoriaki/commands) | — | △ | D | サイズ・硬さが未記録。抹茶という色だけで商品を特定しない |
| 28 | ARTISAN NINJA FX ZERO SOFT / ボドカ | [公開コマンド](https://nightbot.tv/t/vodkavdk/commands) | △ | △ | D | SOFTは明確だがサイズが未記録。サイズ固定リンクを避ける |

### イヤホン・ヘッドセット

| # | 登録製品 / 使用者 | 既存の使用・掲載情報源 | Amazon.co.jp | 楽天市場 | 分類 | 同一性・販売上の注意 |
| ---: | --- | --- | --- | --- | :---: | --- |
| 29 | Apple EarPods with 3.5mm Headphone Plug / 1tappy | [公開コマンド](https://nightbot.tv/t/1tappytheworld/commands) | △ | [○（MWU53FE/A、A1472）](https://item.rakuten.co.jp/gadgetgate/mwu53fea-k/) | A | USB-C / Lightning版と区別する。旧MNHF2FE/Aと現行MWU53FE/Aの扱いはリンク作成時に確認 |
| 30 | Bose QuietComfort 20（QC20） / Cpt、Francisco、Ras、SPYGEA | [Cpt](https://nightbot.tv/t/cr_cpt/commands)、[Francisco](https://nightbot.tv/t/franciscoow/commands)、[Ras](https://nightbot.tv/t/ras_sama/commands)、[SPYGEA](https://nightbot.tv/t/spygea/commands) | △ | △ | D | 旧モデルで端子/OS向けバリエーションがあり、コマンドの「QC20」だけではSKUを確定できない |
| 31 | Sony INZONE Buds（WF-G700N） / k4sen | [本人動画](https://www.youtube.com/watch?v=bmn1il-BCrk&t=165s) | △ | [○](https://item.rakuten.co.jp/tanaka-denki/wf-g700n/) | D | 販売商品は明確だが、本人動画で正確な製品名/型番を再度目視確認するまでリンク保留 |
| 32 | Sony INZONE E9 / Laz | [本人管理のデバイス一覧](https://lazvell.com/about-me/my-devices-2026/) | △ | [○（IER-G900）](https://item.rakuten.co.jp/telaffy/ier-g900-bz/) | A | 市販型番 IER-G900 をリンク作成時の照合キーとして併記候補。データ本体は今回変更しない |
| 33 | Sony INZONE H5（WH-G500） / Dep | [公開コマンド](https://nightbot.tv/t/dep_ow/commands) | △ | [○](https://item.rakuten.co.jp/tanaka-denki/wh-g500/) | A | Nightbot本文は H5。WH-G500はメーカー型番の補足であり、使用者発言の型番ではない |
| 34 | Shure SE846 Clear / shomaru7 | [公開コマンド](https://nightbot.tv/t/shomaru7/commands) | △ | △ | D | 初代/Gen 2 が未確定。Clearだけでは世代を決められない |
| 35 | SteelSeries Arctis 5 Black 2019 Edition / SPYGEA | [公開コマンド](https://nightbot.tv/t/spygea/commands) | △ | △ | C | 明確な旧年式。現行Arctisシリーズへ置換しない |

### マイク・オーディオインターフェース

| # | 登録製品 / 使用者 | 既存の使用・掲載情報源 | Amazon.co.jp | 楽天市場 | 分類 | 同一性・販売上の注意 |
| ---: | --- | --- | --- | --- | :---: | --- |
| 36 | Neumann BCM 104 / k4sen | [本人動画](https://www.youtube.com/watch?v=bmn1il-BCrk&t=165s) | — | — | B | 製品名は明確。プロ音響専門店中心で、モールの同一新品を直接確認できず |
| 37 | Audio-Technica AT2035 / shomaru7、SPYGEA | [shomaru7](https://nightbot.tv/t/shomaru7/commands)、[SPYGEA](https://nightbot.tv/t/spygea/commands) | △ | [○（メーカー公式店）](https://item.rakuten.co.jp/audio-technica/c/0000000010/) | A | 型番が明確。セット品は単品と別扱いにする |
| 38 | Yamaha AG03 / shomaru7 | [公開コマンド](https://nightbot.tv/t/shomaru7/commands) | △ | [△（旧モデル掲載）](https://item.rakuten.co.jp/okumuragakki/yamaha-ag03/) | C | AG03MK2ではない。後継機へ置換しない |
| 39 | Shure MV7 / ta1yo | [公開コマンド](https://nightbot.tv/t/ta1yo_tv/commands) | △ | [△（公式店で売り切れ表示）](https://item.rakuten.co.jp/shure-store/c/0000000103/) | C | MV7+ と別製品。旧MV7の新品在庫は継続未確認 |
| 40 | Shure SM7dB / ボドカ | [公開コマンド](https://nightbot.tv/t/vodkavdk/commands) | △ | [○](https://item.rakuten.co.jp/sunmuse/c/0000000155/) | A | SM7B（dBなし）と別製品 |

## 最優先で購入リンクを検討する10製品

優先順位は「使用/掲載根拠が比較的明確」「製品型番または世代を区別できる」「新品掲載を確認できる」「旧モデルへの誤誘導が少ない」を基準にした。申請前にリンク先を再度開き、新品、販売者、型番、色・配列を確認する。

1. Sony INZONE M10S II（SDM-27Q102）
2. BenQ ZOWIE XL2566X+
3. Sony INZONE E9（市販型番 IER-G900 を再照合）
4. Sony INZONE H5（WH-G500）
5. Razer Viper V3 Pro Faker Edition
6. Razer DeathAdder V3 Pro
7. Logicool G PRO X SUPERLIGHT 2 White
8. Pulsar PCMK 3 HE 60
9. Audio-Technica AT2035
10. Shure SM7dB

次点は Apple EarPods 3.5mm と Logicool G PRO X SUPERLIGHT Magenta。ただし前者は旧/現行の販売番号、後者は初代の限定色在庫を再確認する。

## 型番・根拠の未解決事項

購入リンクを設定しないまま残すべき重要事項:

- **SHAKA / INZONE M10S**: 動画内でM10Sの使用は示されるが、`SDM-27Q10S` の型番は再度画面で目視確認が必要。
- **k4sen / INZONE Buds**: `WF-G700N` を本人動画の表示・発言から再確認するまで保留。
- **1tappy・Dep・ta1yo / INZONE M10S**: Nightbot本文はシリーズ名 `M10S`。型番はコマンド更新者が記載したものではない。
- **Cpt等 / Bose QC20**: 端子/OS向けバリエーションが特定できないうえ旧製品。
- **VSPO! GEAR 如月れんモデル**: 世代未確定。
- **SteelSeries Apex Pro TKL**: 2023 / Gen 3を判別できない。
- **Shure SE846 Clear**: 初代/Gen 2を判別できない。
- **Lethal Gaming Gear Saturn Pro、ARTISAN 99式、ZERO SOFT**: サイズ・硬さが不足。
- **Endgame Gear OP1**: 色が不足し、派生モデルとの混同に注意。
- **Logicool G PRO X Gaming Keyboard**: 配列、スイッチ、世代が不足。

## 既存アフィリエイト実装の監査

### 現在よい点

- `src/config/device-products.ts` に40製品の安定した`productId`があり、49件の記録を表示名に依存せず集約できる。
- 製品台帳とContent Collectionsスキーマの両方で、ID・カテゴリー・メーカー・製品名の対応を検証する。
- Amazonリンクは`productId`単位で中央管理し、リンクがない製品には購入ボタンもPR注記も表示しない。
- Amazon URLはHTTPS、許可ホスト、通常URLのアソシエイトタグを検証する。
- 楽天は発行コード確認まで設定・描画を無効にし、URL抜き出し方式を使用しない。
- プロフィールの `DeviceList.astro` と `/devices/` は、出典リンクと購入リンクを別領域で表示する。
- 購入リンクには `rel="sponsored nofollow noopener noreferrer"` が設定されている。
- 購入リンクがある場合のみ「商品リンクには広告（PR）を含みます」と表示する。
- `/disclosure/` は、現在アフィリエイト未導入であることを明記しており、実態と一致する。

### 改善が必要な点

1. **販売商品識別子の実値は未登録**  
   製品台帳は型番、JAN、ASIN、楽天商品コードを保持できるが、推測を避けるため現在は空。実際の商品ページで確認した値だけを登録する。

2. **販売確認日と再点検状態がない**  
   使用情報の日付とは別に、`commerceLastVerifiedAt`、`availabilityStatus`、`marketplaceProductId` 等をアフィリエイト設定側へ持たせる。価格を固定保存しない。

3. **楽天の発行HTMLとの互換性確認が必要**  
   楽天のガイドラインでは、生成HTMLのURL変更や `a` / `img` 属性の追加・削除・変更を禁止している。実物の発行コードを取得し、改変せず掲載する方式または楽天が明示的に認める方式を決めるまで未実装を維持する。

4. **Amazon参加後の規定文言が未設定**  
   未参加の現在は正しい状態。参加承認後は、Amazon指定のアソシエイト開示文をサイト上の明瞭な位置（少なくとも disclosure、必要ならフッター近辺）に追加し、`site.config.mjs` のサービス状態と整合させる。

## 公式規約の確認事項

### Amazonアソシエイト

- [運営規約](https://affiliate.amazon.co.jp/help/operating/agreement)は、参加者であることを明瞭に開示する指定文言を求めている。**参加前には掲載しない**。
- [プログラム・ポリシー](https://affiliate.amazon.co.jp/help/operating/policies)は、特別リンクの使用、コンテンツの適切な表示、第三者素材の扱い等を定める。
- [申請審査の説明](https://affiliate.amazon.co.jp/help/node/topic/G8TW5AE9XL2VX9VM)では、申請後180日以内の3件の適格販売や、公開済みのオリジナルコンテンツ等が審査要件として案内されている。noindexのままの公開前サイトで先に申請するより、内容・問い合わせ手段・開示を整え、一般公開後に申請する方が適切。
- 商品名、価格、画像、在庫を表示する場合は、手入力や無断画像ではなく、当時のAmazon公式ツール/APIの要件を確認する。今回の実装はテキストボタンだけを対象とする。

### 楽天アフィリエイト

- [ガイドライン](https://affiliate.rakuten.co.jp/guideline/rule/?l-id=afl_top_flash_newguide)では、発行されたリンクコードの改変禁止、リンク先が分かる適切なテキスト、利用者に価値のあるコンテンツ等が示されている。
- [利用規約](https://affiliate.rakuten.co.jp/guideline/terms/)に従い、登録媒体でのみ利用し、リンク切れや不適切なリンク先を定期確認する。
- [ステルスマーケティング規制への対応](https://affiliate.rakuten.co.jp/guideline/stealth_marketing_regulation/)も確認する。法令上の個別判断とは別に、STREAMER AGEでは購入リンクがあるカードにPR表記を常時出す方針を維持する。

## 楽天導入手順

1. STREAMER AGEを一般公開できる品質にし、プライバシー、問い合わせ、広告方針ページを最新状態にする。
2. 楽天アフィリエイトへ登録し、`https://streamerage.jp/` を利用サイトとして登録する。
3. A分類の製品から、型番・世代・色/配列が一致する新品ページを楽天内で開く。
4. 楽天が提供するリンク種類と改変可否を確認する。URLのみ利用可能なリンクであることが確認できた場合だけ中央設定へ登録する。生成HTML必須なら、現行レンダラーを改変せず使える別方式を先に設計する。
5. まず1製品をステージング/Version URLで確認し、リンク先、PR表示、`rel`、モバイル表示をテストする。
6. `site.config.mjs` のアフィリエイト利用状態と `/disclosure/` を、実際の開始日以後に更新する。
7. 月1回程度を目安に、リンク切れ・商品一致・販売終了を点検する。旧モデルを後継機へ自動転送しない。

## Amazon導入の推奨タイミング

Amazonは、**一般公開、noindex解除、十分なオリジナルコンテンツ、問い合わせ手段、広告開示準備が整った後**に申請する。申請直後から180日/3件の条件が動くため、公開前の今は申請しない。申請時には最新の審査要件を再確認し、サイト上の実際のAmazonリンク公開と指定開示文の追加を同じリリースで行う。

## 単なる製品名一覧にしないための改善案

大規模改修は今回行わない。今後、確認済み事実だけで次を追加すると独自価値が増す。

- 「本人の直接発言」「本人管理の一覧」「公式チャンネル公開コマンド」を現在の出典種別バッジで明確に分ける。
- 使用確認日、出典更新日、サイト確認日を意味別に表示する。
- 同じ製品に複数配信者の記録がある場合、使用者数と各出典をまとめて示す。
- 型番・世代・色・配列が未確定な理由を製品カードに短く示す。
- 旧モデルには「後継機とは別製品」「新品販売未確認」を表示し、後継機への購入誘導をしない。
- 製品台帳を導入した後は、製品ごとにメーカー公式仕様、確認済み使用者、確認時点、購入先を整理する。未確認の性能評価やレビューは書かない。
- 販売確認と使用確認を別データにする。販売終了しても史料としての使用記録は残し、購入ボタンだけ停止できるようにする。

## 実装の推奨順序

1. D分類11製品の型番・世代・バリエーションを解決する。
2. `productId`と中央製品台帳への移行は完了。確認できたJAN・ASIN等だけを台帳へ追加する。
3. アフィリエイト設定へ販売確認日と状態を追加する。
4. 楽天の発行コード実物を取得し、安全な掲載形式を楽天の管理画面/サポートで確認する。
5. A分類のうち最優先10製品を1件ずつ照合して登録する。
6. 公開後にAmazonへ申請し、承認・要件確認後にAmazonリンクと指定開示文を追加する。
7. 定期リンク監査をテストまたは運用チェックリスト化する。

## 今回確認できなかった点

- Amazon.co.jpの多くの個別商品ページは、この調査環境から安定して直接取得できなかった。そのためAmazon欄の大半は「△/—」であり、アソシエイト管理画面での最終照合が必要。
- マーケットプレイス出品の「新品」表示が真正品・正規流通・継続在庫であることまでは保証できない。
- 楽天のリンク方式ごとの「URLのみ利用」「独自テキスト」「属性追加」の可否は、実際にアカウントで発行されるリンク種別に依存するため、登録前に再確認が必要。
- Amazon・楽天とも規約は変更され得る。参加申請日と本番リンク登録日に公式規約を再確認する。

