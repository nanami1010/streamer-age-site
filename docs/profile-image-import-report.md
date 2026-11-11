# プロフィール画像一括導入レポート

確認日時（JST）: 2026-11-08

## 実施方針

- 既存JSONに登録済みの公式SNS URLを本人性確認の基準とした。
- Xを優先し、取得できない場合のみYouTube、Twitchの公式プロフィールへ移った。
- 公開プロフィールページのアカウント名と登録ハンドルが一致した画像だけを採用した。
- サイト運営者から対象画像の掲載許可取得済みとの申告を受け、画面表示3用途だけを `confirmed` とした。許諾証跡そのものはリポジトリへ保存していない。
- OGP利用は明示的な許可範囲に含めていない。
- クレジット指定を確認できた場合だけJSONへ記録する方針とした。

## 集計

- 試行: 167人
- 成功: 167人
- 失敗: 0人
- 最適化前合計: 10408.5 KB
- 最適化後合計: 3001.1 KB
- 削減率: 71.2%

## 個別結果

| 配信者 | slug | 結果 | 画像取得元 | 保存先 | 本人性確認 | 利用許可 | クレジット | 元容量 | 最適化後 | 寸法 |
| --- | --- | --- | --- | --- | --- | --- | --- | ---: | ---: | --- |
| 1tappy | `1tappy` | 成功 | [X](https://x.com/1TAPPYTHEWORLD) | `public/images/streamers/1tappy.webp` | Xページのハンドル @1TAPPYTHEWORLD と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 33.9 KB | 24.1 KB | 400x400 → 400x400 |
| 4rufa | `4rufa` | 成功 | [X](https://x.com/4rufq) | `public/images/streamers/4rufa.webp` | Xページのハンドル @4rufq と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 33.8 KB | 24.3 KB | 400x400 → 400x400 |
| あびつん | `abitun` | 成功 | [X](https://x.com/abitun1) | `public/images/streamers/abitun.webp` | Xページのハンドル @abitun1 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 27.8 KB | 18.9 KB | 399x399 → 399x399 |
| 赤髪のとも | `akagami-no-tomo` | 成功 | [X](https://x.com/tomo0723sw) | `public/images/streamers/akagami-no-tomo.webp` | Xページのハンドル @tomo0723sw と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 26.3 KB | 16.1 KB | 400x400 → 400x400 |
| あれる | `alelu` | 成功 | [X](https://x.com/apexalelu) | `public/images/streamers/alelu.webp` | Xページのハンドル @apexalelu と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 18.8 KB | 11.3 KB | 400x400 → 400x400 |
| AlphaAzur | `alpha-azur` | 成功 | [X](https://x.com/AzurAlpha) | `public/images/streamers/alpha-azur.webp` | Xページのハンドル @AzurAlpha と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 32.8 KB | 24.4 KB | 400x400 → 400x400 |
| ありけん | `ariken` | 成功 | [X](https://x.com/guraburuslot777) | `public/images/streamers/ariken.webp` | Xページのハンドル @guraburuslot777 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 35.0 KB | 26.9 KB | 400x400 → 400x400 |
| Arisakaaa | `arisakaaa` | 成功 | [X](https://x.com/ArisakaaaT) | `public/images/streamers/arisakaaa.webp` | Xページのハンドル @ArisakaaaT と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 32.8 KB | 23.4 KB | 400x400 → 400x400 |
| あっさりしょこ | `assari-shoko` | 成功 | [X](https://x.com/Saaanjjiii) | `public/images/streamers/assari-shoko.webp` | Xページのハンドル @Saaanjjiii と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 19.4 KB | 12.7 KB | 400x400 → 400x400 |
| Axis | `axis` | 成功 | [X](https://x.com/axiss311) | `public/images/streamers/axis.webp` | Xページのハンドル @axiss311 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 34.7 KB | 29.3 KB | 400x400 → 400x400 |
| Bonchan | `bonchan` | 成功 | [X](https://x.com/katitagaribon) | `public/images/streamers/bonchan.webp` | Xページのハンドル @katitagaribon と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 17.0 KB | 12.0 KB | 299x299 → 299x299 |
| ぼんじゅうる | `bonjour` | 成功 | [X](https://x.com/bonj5555) | `public/images/streamers/bonjour.webp` | Xページのハンドル @bonj5555 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 28.5 KB | 19.8 KB | 400x400 → 400x400 |
| BRIAN | `brian` | 成功 | [X](https://x.com/BRIANvlrt) | `public/images/streamers/brian.webp` | Xページのハンドル @BRIANvlrt と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 33.3 KB | 26.1 KB | 373x373 → 373x373 |
| Ceros | `ceros` | 成功 | [X](https://x.com/trollceros) | `public/images/streamers/ceros.webp` | Xページのハンドル @trollceros と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 11.1 KB | 5.7 KB | 306x306 → 306x306 |
| City | `city` | 成功 | [X](https://x.com/cityy_V) | `public/images/streamers/city.webp` | Xページのハンドル @cityy_V と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 18.7 KB | 10.1 KB | 400x400 → 400x400 |
| Clutch_Fi | `clutch-fi` | 成功 | [X](https://x.com/Clutch_Fi) | `public/images/streamers/clutch-fi.webp` | Xページのハンドル @Clutch_Fi と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 22.5 KB | 14.1 KB | 400x400 → 400x400 |
| cosa | `cosa` | 成功 | [X](https://x.com/cosazeku) | `public/images/streamers/cosa.webp` | Xページのハンドル @cosazeku と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 22.9 KB | 16.3 KB | 400x400 → 400x400 |
| Cpt | `cpt` | 成功 | [X](https://x.com/ApexerCpt) | `public/images/streamers/cpt.webp` | Xページのハンドル @ApexerCpt と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 29.2 KB | 20.5 KB | 400x400 → 400x400 |
| crow | `crow` | 成功 | [X](https://x.com/no960fps) | `public/images/streamers/crow.webp` | Xページのハンドル @no960fps と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 36.6 KB | 27.9 KB | 399x399 → 399x399 |
| CURUMI | `curumi` | 成功 | [X](https://x.com/milk_crm) | `public/images/streamers/curumi.webp` | Xページのハンドル @milk_crm と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 24.6 KB | 16.4 KB | 400x400 → 400x400 |
| Daruma is god | `daruma-is-god` | 成功 | [X](https://x.com/darumaisgod) | `public/images/streamers/daruma-is-god.webp` | Xページのハンドル @darumaisgod と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 32.5 KB | 22.0 KB | 400x400 → 400x400 |
| 蛇足 | `dasoku` | 成功 | [X](https://x.com/dasoku_youtube) | `public/images/streamers/dasoku.webp` | Xページのハンドル @dasoku_youtube と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 30.9 KB | 19.7 KB | 400x400 → 400x400 |
| Day1 | `day1` | 成功 | [X](https://x.com/Day1week) | `public/images/streamers/day1.webp` | Xページのハンドル @Day1week と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 19.0 KB | 13.1 KB | 281x281 → 281x281 |
| Dep | `dep` | 成功 | [X](https://x.com/Dep_ow) | `public/images/streamers/dep.webp` | Xページのハンドル @Dep_ow と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 30.8 KB | 22.0 KB | 400x400 → 400x400 |
| Devine | `devine` | 成功 | [X](https://x.com/Devine_pubg) | `public/images/streamers/devine.webp` | Xページのハンドル @Devine_pubg と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 38.5 KB | 30.1 KB | 400x400 → 400x400 |
| dogura | `dogura` | 成功 | [X](https://x.com/maneater_dgr) | `public/images/streamers/dogura.webp` | Xページのハンドル @maneater_dgr と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 21.1 KB | 14.4 KB | 400x400 → 400x400 |
| ドンピシャ | `donpisha` | 成功 | [X](https://x.com/DONPISHA22) | `public/images/streamers/donpisha.webp` | Xページのハンドル @DONPISHA22 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 32.8 KB | 23.5 KB | 399x399 → 399x399 |
| ドズル | `dozle` | 成功 | [X](https://x.com/kurakurachannel) | `public/images/streamers/dozle.webp` | Xページのハンドル @kurakurachannel と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 32.2 KB | 22.9 KB | 400x400 → 400x400 |
| Egi | `egi` | 成功 | [X](https://x.com/eg_valo) | `public/images/streamers/egi.webp` | Xページのハンドル @eg_valo と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 22.2 KB | 13.3 KB | 400x400 → 400x400 |
| Enty | `enty` | 成功 | [X](https://x.com/entyyyyyy) | `public/images/streamers/enty.webp` | Xページのハンドル @entyyyyyy と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 54.5 KB | 52.5 KB | 400x400 → 400x400 |
| Eugeo | `eugeo` | 成功 | [X](https://x.com/AurEugeo) | `public/images/streamers/eugeo.webp` | Xページのハンドル @AurEugeo と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 15.2 KB | 8.6 KB | 400x400 → 400x400 |
| Euriece | `euriece` | 成功 | [X](https://x.com/realEuriece) | `public/images/streamers/euriece.webp` | Xページのハンドル @realEuriece と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 30.7 KB | 21.2 KB | 400x400 → 400x400 |
| ファン太 | `fanta` | 成功 | [YouTube](https://www.youtube.com/channel/UCWlx7GTk0zQCi_0tKJhV72w) | `public/images/streamers/fanta.webp` | YouTube公式URLと登録URLが一致（取得先: www.youtube.com） | 運営者申告により確認済み | 不要（指定なし） | 12.5 KB | 1.8 KB | 900x900 → 512x512 |
| Francisco | `francisco` | 成功 | [X](https://x.com/Franciscooo_T) | `public/images/streamers/francisco.webp` | Xページのハンドル @Franciscooo_T と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 16.4 KB | 10.5 KB | 400x400 → 400x400 |
| 風次 | `fuji` | 成功 | [X](https://x.com/bulldozer_fuji) | `public/images/streamers/fuji.webp` | Xページのハンドル @bulldozer_fuji と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 31.8 KB | 21.6 KB | 400x400 → 400x400 |
| 布団ちゃん | `futonchan` | 成功 | [X](https://x.com/indegnasen210) | `public/images/streamers/futonchan.webp` | Xページのハンドル @indegnasen210 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 15.7 KB | 8.0 KB | 400x400 → 400x400 |
| ふ～ど | `fuudo` | 成功 | [X](https://x.com/TheFuudo) | `public/images/streamers/fuudo.webp` | Xページのハンドル @TheFuudo と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 21.8 KB | 13.8 KB | 400x400 → 400x400 |
| ごっちゃんマイキー | `gocchan-mikey` | 成功 | [X](https://x.com/_GocChaN_) | `public/images/streamers/gocchan-mikey.webp` | Xページのハンドル @_GocChaN_ と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 20.4 KB | 13.8 KB | 400x400 → 400x400 |
| GON | `gon` | 成功 | [X](https://x.com/gonsan_vl) | `public/images/streamers/gon.webp` | Xページのハンドル @gonsan_vl と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 8.5 KB | 3.5 KB | 234x234 → 234x234 |
| ゴー☆ジャス | `gorgeous` | 成功 | [X](https://x.com/Gorgeous55555) | `public/images/streamers/gorgeous.webp` | Xページのハンドル @Gorgeous55555 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 34.7 KB | 26.5 KB | 400x400 → 400x400 |
| ぐちつぼ | `guchitsubo` | 成功 | [X](https://x.com/gutituvo) | `public/images/streamers/guchitsubo.webp` | Xページのハンドル @gutituvo と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 8.2 KB | 4.5 KB | 215x215 → 215x215 |
| ハイタニ | `haitani` | 成功 | [X](https://x.com/hai090) | `public/images/streamers/haitani.webp` | Xページのハンドル @hai090 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 22.4 KB | 14.1 KB | 400x400 → 400x400 |
| ハレっち | `haretti` | 成功 | [X](https://x.com/harehare215) | `public/images/streamers/haretti.webp` | Xページのハンドル @harehare215 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 18.5 KB | 9.0 KB | 400x400 → 400x400 |
| ハセシン | `haseshin` | 成功 | [X](https://x.com/HASESHIN_ESHS) | `public/images/streamers/haseshin.webp` | Xページのハンドル @HASESHIN_ESHS と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 36.4 KB | 25.5 KB | 400x400 → 400x400 |
| hetel | `hetel` | 成功 | [X](https://x.com/heteel) | `public/images/streamers/hetel.webp` | Xページのハンドル @heteel と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 26.7 KB | 17.4 KB | 400x400 → 400x400 |
| ひぐち | `higuchi` | 成功 | [X](https://x.com/higuchi010914) | `public/images/streamers/higuchi.webp` | Xページのハンドル @higuchi010914 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 20.0 KB | 13.0 KB | 400x400 → 400x400 |
| Hotoke | `hotoke` | 成功 | [X](https://x.com/MaximusHotoke) | `public/images/streamers/hotoke.webp` | Xページのハンドル @MaximusHotoke と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 24.2 KB | 17.6 KB | 400x400 → 400x400 |
| JapaneseKoreanUG | `japanese-korean-ug` | 成功 | [X](https://x.com/JPKR_UG) | `public/images/streamers/japanese-korean-ug.webp` | Xページのハンドル @JPKR_UG と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 23.9 KB | 15.4 KB | 400x400 → 400x400 |
| じゃすぱー | `jasper` | 成功 | [X](https://x.com/Jasper7se) | `public/images/streamers/jasper.webp` | Xページのハンドル @Jasper7se と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 14.6 KB | 8.7 KB | 301x301 → 301x301 |
| Justive7 | `justive7` | 成功 | [X](https://x.com/justive_4) | `public/images/streamers/justive7.webp` | Xページのハンドル @justive_4 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 36.0 KB | 28.6 KB | 400x400 → 400x400 |
| k4sen | `k4sen` | 成功 | [X](https://x.com/k4sen) | `public/images/streamers/k4sen.webp` | Xページのハンドル @k4sen と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 36.3 KB | 26.3 KB | 400x400 → 400x400 |
| 狩野英孝 | `kano-eiko` | 成功 | [X](https://x.com/kano9x) | `public/images/streamers/kano-eiko.webp` | Xページのハンドル @kano9x と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 27.3 KB | 18.1 KB | 400x400 → 400x400 |
| 加藤純一 | `kato-junichi` | 成功 | [X](https://x.com/unkochan1234567) | `public/images/streamers/kato-junichi.webp` | Xページのハンドル @unkochan1234567 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 10.8 KB | 4.4 KB | 334x334 → 334x334 |
| kawase | `kawase` | 成功 | [X](https://x.com/gg_kawase) | `public/images/streamers/kawase.webp` | Xページのハンドル @gg_kawase と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 35.4 KB | 26.0 KB | 399x399 → 399x399 |
| Kazunoko | `kazunoko` | 成功 | [X](https://x.com/kazunoko0215) | `public/images/streamers/kazunoko.webp` | Xページのハンドル @kazunoko0215 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 17.3 KB | 11.1 KB | 400x400 → 400x400 |
| けんき | `kenki` | 成功 | [X](https://x.com/T_kenki) | `public/images/streamers/kenki.webp` | Xページのハンドル @T_kenki と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 13.8 KB | 7.1 KB | 400x400 → 400x400 |
| KENTSUMESHI | `kentsumeshi` | 成功 | [X](https://x.com/Kent_Golemeshi) | `public/images/streamers/kentsumeshi.webp` | Xページのハンドル @Kent_Golemeshi と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 16.0 KB | 8.6 KB | 400x400 → 400x400 |
| kept | `kept` | 成功 | [X](https://x.com/FaintKept) | `public/images/streamers/kept.webp` | Xページのハンドル @FaintKept と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 17.6 KB | 10.4 KB | 400x400 → 400x400 |
| けっつん | `kettsun` | 成功 | [X](https://x.com/kettuncyukyuhei) | `public/images/streamers/kettsun.webp` | Xページのハンドル @kettuncyukyuhei と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 19.3 KB | 11.9 KB | 400x400 → 400x400 |
| Killin9Hit | `killin9hit` | 成功 | [X](https://x.com/Killin9Hit) | `public/images/streamers/killin9hit.webp` | Xページのハンドル @Killin9Hit と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 17.8 KB | 10.4 KB | 400x400 → 400x400 |
| kinako | `kinako` | 成功 | [X](https://x.com/kinako_pop) | `public/images/streamers/kinako.webp` | Xページのハンドル @kinako_pop と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 44.7 KB | 35.8 KB | 400x400 → 400x400 |
| こく兄 | `kokunii` | 成功 | [X](https://x.com/kokujind) | `public/images/streamers/kokunii.webp` | Xページのハンドル @kokujind と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 33.1 KB | 23.3 KB | 400x400 → 400x400 |
| komaru | `komaru` | 成功 | [X](https://x.com/komaru_gg) | `public/images/streamers/komaru.webp` | Xページのハンドル @komaru_gg と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 28.1 KB | 19.7 KB | 400x400 → 400x400 |
| くらら | `kurara` | 成功 | [X](https://x.com/kurara__a) | `public/images/streamers/kurara.webp` | Xページのハンドル @kurara__a と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 23.1 KB | 15.1 KB | 400x400 → 400x400 |
| クロノア | `kuronoa` | 成功 | [X](https://x.com/kuronoa121) | `public/images/streamers/kuronoa.webp` | Xページのハンドル @kuronoa121 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 31.9 KB | 21.2 KB | 400x400 → 400x400 |
| 恭一郎 | `kyoichiro` | 成功 | [X](https://x.com/kyouitirou2525) | `public/images/streamers/kyoichiro.webp` | Xページのハンドル @kyouitirou2525 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 182.8 KB | 14.3 KB | 400x400 → 400x400 |
| L1ng | `l1ng` | 成功 | [X](https://x.com/L1ng_ftw) | `public/images/streamers/l1ng.webp` | Xページのハンドル @L1ng_ftw と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 22.0 KB | 12.8 KB | 400x400 → 400x400 |
| Laz | `laz` | 成功 | [X](https://x.com/lazvell) | `public/images/streamers/laz.webp` | Xページのハンドル @lazvell と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 17.6 KB | 10.2 KB | 400x400 → 400x400 |
| リロイ太郎 | `leroy-taro` | 成功 | [X](https://x.com/leroytaro) | `public/images/streamers/leroy-taro.webp` | Xページのハンドル @leroytaro と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 19.9 KB | 11.3 KB | 400x400 → 400x400 |
| Levi | `levi` | 成功 | [X](https://x.com/Levi_ibs) | `public/images/streamers/levi.webp` | Xページのハンドル @Levi_ibs と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 27.2 KB | 17.4 KB | 400x400 → 400x400 |
| リモーネ先生 | `limone-sensei` | 成功 | [X](https://x.com/limodom) | `public/images/streamers/limone-sensei.webp` | Xページのハンドル @limodom と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 25.1 KB | 17.0 KB | 400x400 → 400x400 |
| まちゃぼー | `machabo` | 成功 | [X](https://x.com/mcb_0726) | `public/images/streamers/machabo.webp` | Xページのハンドル @mcb_0726 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 26.3 KB | 19.4 KB | 400x400 → 400x400 |
| Mainy | `mainy` | 成功 | [X](https://x.com/SuperMeyNE) | `public/images/streamers/mainy.webp` | Xページのハンドル @SuperMeyNE と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 31.4 KB | 22.1 KB | 400x400 → 400x400 |
| MARUTAKE | `marutake` | 成功 | [X](https://x.com/A_Marutake) | `public/images/streamers/marutake.webp` | Xページのハンドル @A_Marutake と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 21.5 KB | 13.7 KB | 400x400 → 400x400 |
| Meiy | `meiy` | 成功 | [X](https://x.com/meiyfps) | `public/images/streamers/meiy.webp` | Xページのハンドル @meiyfps と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 25.4 KB | 16.7 KB | 400x400 → 400x400 |
| mittiii | `mittiii` | 成功 | [X](https://x.com/mittiii) | `public/images/streamers/mittiii.webp` | Xページのハンドル @mittiii と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 37.7 KB | 29.7 KB | 400x400 → 400x400 |
| もこう | `mokou` | 成功 | [X](https://x.com/mokouliszt) | `public/images/streamers/mokou.webp` | Xページのハンドル @mokouliszt と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 8.0 KB | 4.7 KB | 239x239 → 239x239 |
| Mondo | `mondo` | 成功 | [X](https://x.com/Mondo2233) | `public/images/streamers/mondo.webp` | Xページのハンドル @Mondo2233 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 20.3 KB | 13.5 KB | 400x400 → 400x400 |
| まざー3 | `mother3` | 成功 | [X](https://x.com/mother3rrd) | `public/images/streamers/mother3.webp` | Xページのハンドル @mother3rrd と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 13.7 KB | 6.7 KB | 400x400 → 400x400 |
| なぎさっち | `nagisatti` | 成功 | [X](https://x.com/Nagiponpoko) | `public/images/streamers/nagisatti.webp` | Xページのハンドル @Nagiponpoko と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 37.1 KB | 26.9 KB | 400x400 → 400x400 |
| ネモ | `nemo` | 成功 | [X](https://x.com/GOOD_NEMO) | `public/images/streamers/nemo.webp` | Xページのハンドル @GOOD_NEMO と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 16.4 KB | 10.2 KB | 399x399 → 399x399 |
| neth | `neth` | 成功 | [X](https://x.com/neth_vz) | `public/images/streamers/neth.webp` | Xページのハンドル @neth_vz と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 31.4 KB | 22.1 KB | 400x400 → 400x400 |
| 野田クリスタル | `noda-crystal` | 成功 | [X](https://x.com/nodacry) | `public/images/streamers/noda-crystal.webp` | Xページのハンドル @nodacry と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 23.1 KB | 14.3 KB | 400x400 → 400x400 |
| obo | `obo` | 成功 | [X](https://x.com/obormentv) | `public/images/streamers/obo.webp` | Xページのハンドル @obormentv と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 20.2 KB | 12.1 KB | 400x400 → 400x400 |
| おにや | `oniya` | 成功 | [X](https://x.com/oniyanogame) | `public/images/streamers/oniya.webp` | Xページのハンドル @oniyanogame と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 17.5 KB | 9.6 KB | 400x400 → 400x400 |
| おおはらMEN | `oohara-men` | 成功 | [X](https://x.com/oohara0013) | `public/images/streamers/oohara-men.webp` | Xページのハンドル @oohara0013 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 30.8 KB | 21.3 KB | 400x400 → 400x400 |
| おらふくん | `oraf-kun` | 成功 | [X](https://x.com/yukiorajp) | `public/images/streamers/oraf-kun.webp` | Xページのハンドル @yukiorajp と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 35.5 KB | 25.0 KB | 400x400 → 400x400 |
| OTANI | `otani` | 成功 | [X](https://x.com/otani_saru) | `public/images/streamers/otani.webp` | Xページのハンドル @otani_saru と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 15.8 KB | 8.5 KB | 400x400 → 400x400 |
| おついち | `otsuichi` | 成功 | [X](https://x.com/otsuichich) | `public/images/streamers/otsuichi.webp` | Xページのハンドル @otsuichich と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 29.8 KB | 19.7 KB | 400x400 → 400x400 |
| ぺいんと | `peinto` | 成功 | [X](https://x.com/peintooon) | `public/images/streamers/peinto.webp` | Xページのハンドル @peintooon と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 36.2 KB | 25.2 KB | 400x400 → 400x400 |
| おんりー | `qnly` | 成功 | [X](https://x.com/qnlyq) | `public/images/streamers/qnly.webp` | Xページのハンドル @qnlyq と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 33.3 KB | 24.0 KB | 400x400 → 400x400 |
| らっだぁ | `rader` | 成功 | [X](https://x.com/radaokun) | `public/images/streamers/rader.webp` | Xページのハンドル @radaokun と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 17.0 KB | 8.0 KB | 400x400 → 400x400 |
| らいじん | `raijin` | 成功 | [X](https://x.com/Eclair08) | `public/images/streamers/raijin.webp` | Xページのハンドル @Eclair08 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 16.5 KB | 9.7 KB | 400x400 → 400x400 |
| Rainbrain | `rainbrain` | 成功 | [Twitch](https://www.twitch.tv/rainbrain) | `public/images/streamers/rainbrain.webp` | Twitch公式URLと登録URLが一致（取得先: www.twitch.tv） | 運営者申告により確認済み | 不要（指定なし） | 88.4 KB | 18.2 KB | 300x300 → 300x300 |
| Ras | `ras` | 成功 | [X](https://x.com/Ras9915) | `public/images/streamers/ras.webp` | Xページのハンドル @Ras9915 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 20.3 KB | 12.6 KB | 400x400 → 400x400 |
| レトルト | `retort` | 成功 | [YouTube](https://www.youtube.com/@retokani) | `public/images/streamers/retort.webp` | YouTube公式URLと登録URLが一致（取得先: www.youtube.com） | 運営者申告により確認済み | 不要（指定なし） | 95.0 KB | 27.2 KB | 900x900 → 512x512 |
| rion | `rion` | 成功 | [X](https://x.com/R_7qq) | `public/images/streamers/rion.webp` | Xページのハンドル @R_7qq と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 26.0 KB | 16.7 KB | 399x399 → 399x399 |
| sako | `sako` | 成功 | [X](https://x.com/sakonoko) | `public/images/streamers/sako.webp` | Xページのハンドル @sakonoko と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 30.5 KB | 21.4 KB | 400x400 → 400x400 |
| SaRa | `sara` | 成功 | [X](https://x.com/BLUEBERRYNOOB__) | `public/images/streamers/sara.webp` | Xページのハンドル @BLUEBERRYNOOB__ と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 11.7 KB | 6.8 KB | 400x400 → 400x400 |
| Sasatikk | `sasatikk` | 成功 | [X](https://x.com/sasatikk) | `public/images/streamers/sasatikk.webp` | Xページのハンドル @sasatikk と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 18.8 KB | 10.9 KB | 400x400 → 400x400 |
| 関優太 | `seki-yuta` | 成功 | [X](https://x.com/stylishnoob) | `public/images/streamers/seki-yuta.webp` | Xページのハンドル @stylishnoob と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 20.6 KB | 11.9 KB | 399x399 → 399x399 |
| Selly | `selly` | 成功 | [X](https://x.com/Selly_ow) | `public/images/streamers/selly.webp` | Xページのハンドル @Selly_ow と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 20.7 KB | 13.4 KB | 400x400 → 400x400 |
| SHAKA | `shaka` | 成功 | [X](https://x.com/avashaka) | `public/images/streamers/shaka.webp` | Xページのハンドル @avashaka と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 26.3 KB | 19.0 KB | 400x400 → 400x400 |
| しょぼすけ | `shobosuke` | 成功 | [X](https://x.com/ShoboLinco) | `public/images/streamers/shobosuke.webp` | Xページのハンドル @ShoboLinco と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 29.3 KB | 19.3 KB | 400x400 → 400x400 |
| shomaru7 | `shomaru7` | 成功 | [X](https://x.com/shomarusamaa) | `public/images/streamers/shomaru7.webp` | Xページのハンドル @shomarusamaa と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 23.7 KB | 14.3 KB | 400x400 → 400x400 |
| Shuto | `shuto` | 成功 | [X](https://x.com/Shuto_fgc) | `public/images/streamers/shuto.webp` | Xページのハンドル @Shuto_fgc と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 18.4 KB | 12.5 KB | 400x400 → 400x400 |
| Shuton | `shuton` | 成功 | [X](https://x.com/syu_tolimar) | `public/images/streamers/shuton.webp` | Xページのハンドル @syu_tolimar と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 18.3 KB | 10.1 KB | 400x400 → 400x400 |
| しにがみ | `sinigami` | 成功 | [X](https://x.com/sinigami227) | `public/images/streamers/sinigami.webp` | Xページのハンドル @sinigami227 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 33.3 KB | 22.3 KB | 400x400 → 400x400 |
| Soba | `soba` | 成功 | [X](https://x.com/kona_0603) | `public/images/streamers/soba.webp` | Xページのハンドル @kona_0603 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 24.6 KB | 16.3 KB | 400x400 → 400x400 |
| SPYGEA | `spygea` | 成功 | [X](https://x.com/spygea_jp) | `public/images/streamers/spygea.webp` | Xページのハンドル @spygea_jp と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 23.5 KB | 15.0 KB | 400x400 → 400x400 |
| SqLA | `sqla` | 成功 | [X](https://x.com/imsqla) | `public/images/streamers/sqla.webp` | Xページのハンドル @imsqla と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 26.1 KB | 16.6 KB | 400x400 → 400x400 |
| すもも | `sumomo` | 成功 | [X](https://x.com/SUMOMOXqX) | `public/images/streamers/sumomo.webp` | Xページのハンドル @SUMOMOXqX と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 20.6 KB | 12.3 KB | 400x400 → 400x400 |
| スタンミじゃぱん | `sutanmi-japan` | 成功 | [X](https://x.com/sutanmiJPN) | `public/images/streamers/sutanmi-japan.webp` | Xページのハンドル @sutanmiJPN と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 22.8 KB | 14.0 KB | 400x400 → 400x400 |
| 鈴木ノリアキ | `suzuki-noriaki` | 成功 | [X](https://x.com/NORIAKIISGOOD) | `public/images/streamers/suzuki-noriaki.webp` | Xページのハンドル @NORIAKIISGOOD と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 26.9 KB | 16.9 KB | 400x400 → 400x400 |
| しゃるる | `syaruru` | 成功 | [X](https://x.com/syaruruuu) | `public/images/streamers/syaruru.webp` | Xページのハンドル @syaruruuu と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 16.9 KB | 9.0 KB | 400x400 → 400x400 |
| ta1yo | `ta1yo` | 成功 | [X](https://x.com/ta1yo_tv) | `public/images/streamers/ta1yo.webp` | Xページのハンドル @ta1yo_tv と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 20.7 KB | 14.2 KB | 400x400 → 400x400 |
| たいじ | `taiji` | 成功 | [X](https://x.com/taijich0324) | `public/images/streamers/taiji.webp` | Xページのハンドル @taijich0324 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 27.1 KB | 16.6 KB | 400x400 → 400x400 |
| たかやスペシャル | `takaya-special` | 成功 | [X](https://x.com/PowerofTakaya) | `public/images/streamers/takaya-special.webp` | Xページのハンドル @PowerofTakaya と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 31.3 KB | 23.3 KB | 400x400 → 400x400 |
| たきしま | `takishima` | 成功 | [X](https://x.com/Takishima_1222) | `public/images/streamers/takishima.webp` | Xページのハンドル @Takishima_1222 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 15.5 KB | 7.2 KB | 400x400 → 400x400 |
| たぬき忍者 | `tanuki-ninja` | 成功 | [X](https://x.com/tanukininja_jp) | `public/images/streamers/tanuki-ninja.webp` | Xページのハンドル @tanukininja_jp と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 10.8 KB | 8.7 KB | 400x400 → 400x400 |
| ときど | `tokido` | 成功 | [X](https://x.com/tokidoki77) | `public/images/streamers/tokido.webp` | Xページのハンドル @tokidoki77 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 31.1 KB | 22.5 KB | 400x400 → 400x400 |
| TON・GG | `ton-gg` | 成功 | [X](https://x.com/TON0465) | `public/images/streamers/ton-gg.webp` | Xページのハンドル @TON0465 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 12.7 KB | 6.6 KB | 399x399 → 399x399 |
| トナカイト | `tonakaito` | 成功 | [X](https://x.com/k_najimi) | `public/images/streamers/tonakaito.webp` | Xページのハンドル @k_najimi と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 15.3 KB | 7.8 KB | 400x400 → 400x400 |
| トラゾー | `torazo` | 成功 | [X](https://x.com/torazo52nips79) | `public/images/streamers/torazo.webp` | Xページのハンドル @torazo52nips79 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 23.1 KB | 14.4 KB | 400x400 → 400x400 |
| ととみっくす | `totomix` | 成功 | [X](https://x.com/mix_totot) | `public/images/streamers/totomix.webp` | Xページのハンドル @mix_totot と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 26.7 KB | 18.4 KB | 400x400 → 400x400 |
| tttcheekyttt | `tttcheekyttt` | 成功 | [X](https://x.com/tttcheekyttt) | `public/images/streamers/tttcheekyttt.webp` | Xページのハンドル @tttcheekyttt と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 40.8 KB | 31.2 KB | 400x400 → 400x400 |
| ウメハラ | `umehara` | 成功 | [X](https://x.com/daigothebeastJP) | `public/images/streamers/umehara.webp` | Xページのハンドル @daigothebeastJP と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 23.4 KB | 14.8 KB | 400x400 → 400x400 |
| uruca | `uruca` | 成功 | [X](https://x.com/ow_uruca) | `public/images/streamers/uruca.webp` | Xページのハンドル @ow_uruca と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 40.2 KB | 28.8 KB | 400x400 → 400x400 |
| VanilLa | `vanilla` | 成功 | [X](https://x.com/VanilLaaa12) | `public/images/streamers/vanilla.webp` | Xページのハンドル @VanilLaaa12 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 47.8 KB | 37.5 KB | 400x400 → 400x400 |
| ボドカ | `vodka` | 成功 | [X](https://x.com/VodkaChaso) | `public/images/streamers/vodka.webp` | Xページのハンドル @VodkaChaso と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 49.8 KB | 44.7 KB | 400x400 → 400x400 |
| わしだい | `washidai` | 成功 | [X](https://x.com/Washidai_) | `public/images/streamers/washidai.webp` | Xページのハンドル @Washidai_ と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 24.7 KB | 16.6 KB | 400x400 → 400x400 |
| xnfri | `xnfri` | 成功 | [X](https://x.com/xnfri_) | `public/images/streamers/xnfri.webp` | Xページのハンドル @xnfri_ と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 12.9 KB | 6.5 KB | 400x400 → 400x400 |
| 焼きパン | `yakipan` | 成功 | [X](https://x.com/VarvaIian) | `public/images/streamers/yakipan.webp` | Xページのハンドル @VarvaIian と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 18.7 KB | 10.0 KB | 400x400 → 400x400 |
| YAS | `yas` | 成功 | [X](https://x.com/yas_jittyoku) | `public/images/streamers/yas.webp` | Xページのハンドル @yas_jittyoku と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 16.5 KB | 10.2 KB | 400x400 → 400x400 |
| 夜よいち | `yoru-yoichi` | 成功 | [X](https://x.com/YoruYoichi) | `public/images/streamers/yoru-yoichi.webp` | Xページのハンドル @YoruYoichi と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 170.7 KB | 19.3 KB | 350x350 → 350x350 |
| ゆふな | `yufuna` | 成功 | [X](https://x.com/_YFNA) | `public/images/streamers/yufuna.webp` | Xページのハンドル @_YFNA と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 26.1 KB | 16.8 KB | 400x400 → 400x400 |
| ゆきお | `yukio` | 成功 | [X](https://x.com/YukioFPS) | `public/images/streamers/yukio.webp` | Xページのハンドル @YukioFPS と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 24.8 KB | 15.3 KB | 400x400 → 400x400 |
| yunocy | `yunocy` | 成功 | [X](https://x.com/mizuyuno_) | `public/images/streamers/yunocy.webp` | Xページのハンドル @mizuyuno_ と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 25.6 KB | 15.9 KB | 400x400 → 400x400 |
| Yutapon | `yutapon` | 成功 | [X](https://x.com/yutapongo) | `public/images/streamers/yutapon.webp` | Xページのハンドル @yutapongo と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 2.1 KB | 1.2 KB | 48x48 → 48x48 |
| Zerost | `zerost` | 成功 | [X](https://x.com/Zerost_s) | `public/images/streamers/zerost.webp` | Xページのハンドル @Zerost_s と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 22.4 KB | 13.3 KB | 400x400 → 400x400 |
| ズズ | `zuzu` | 成功 | [X](https://x.com/zetyou2) | `public/images/streamers/zuzu.webp` | Xページのハンドル @zetyou2 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 33.6 KB | 22.7 KB | 400x400 → 400x400 |
| みゃこ | `myako` | 成功 | [X](https://x.com/myakkomyako) | `public/images/streamers/myako.webp` | Xページのハンドル @myakkomyako と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 29.2 KB | 20.3 KB | 400x400 → 512x512 |
| 伊織もえ | `iori-moe` | 成功 | [X](https://x.com/iorimoe_five) | `public/images/streamers/iori-moe.webp` | Xページのハンドル @iorimoe_five と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 32.7 KB | 21.1 KB | 400x400 → 512x512 |
| misaco | `misaco` | 成功 | [X](https://x.com/oOsuyaaaOo) | `public/images/streamers/misaco.webp` | Xページのハンドル @oOsuyaaaOo と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 27.4 KB | 17.6 KB | 400x400 → 512x512 |
| えなこ | `enako` | 成功 | [X](https://x.com/enako_cos) | `public/images/streamers/enako.webp` | Xページのハンドル @enako_cos と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 23.5 KB | 12.9 KB | 400x400 → 512x512 |
| あゆたろう | `ayutaro` | 成功 | [X](https://x.com/ayutaro_728) | `public/images/streamers/ayutaro.webp` | Xページのハンドル @ayutaro_728 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 25.4 KB | 17.7 KB | 400x400 → 512x512 |
| バトラ | `batora` | 成功 | [X](https://x.com/batora324) | `public/images/streamers/batora.webp` | Xページのハンドル @batora324 と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 18.0 KB | 10.4 KB | 400x400 → 512x512 |
| ゆゆうた | `yuyuuta` | 成功 | [X](https://x.com/dai2noyuyuta) | `public/images/streamers/yuyuuta.webp` | Xページのハンドル @dai2noyuyuta と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 15.3 KB | 9.3 KB | 400x400 → 512x512 |
| Biju | `biju` | 成功 | [X](https://x.com/Biju_valo) | `public/images/streamers/biju.webp` | Xページのハンドル @Biju_valo と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 27.0 KB | 16.7 KB | 400x400 → 512x512 |
| 幕末志士・坂本 | `bakumatsu-sakamoto` | 成功 | [X](https://x.com/kirizaki_ei) | `public/images/streamers/bakumatsu-sakamoto.webp` | Xページのハンドル @kirizaki_ei と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 7.0 KB | 4.7 KB | 240x240 → 512x512 |
| しんじさん | `shinji-san` | 成功 | [X](https://x.com/Shinjisan_XD) | `public/images/streamers/shinji-san.webp` | Xページのハンドル @Shinjisan_XD と登録URLが一致 | 運営者申告により確認済み | 不要（指定なし） | 15.7 KB | 9.2 KB | 400x400 → 512x512 |
| ANS | `ans` | 成功 | [Crazy Raccoon公式](https://crazyraccoon.jp/member/ans/) | `public/images/streamers/ans.webp` | 公式メンバーページのANS画像を採用 | 運営者申告により確認済み | 不要（指定なし） | 322.6 KB | 37.1 KB | 800x1040 → 512x512 |
| RIGZE | `rigze` | 成功 | [Crazy Raccoon公式](https://crazyraccoon.jp/member/rigze/) | `public/images/streamers/rigze.webp` | 公式メンバーページのRIGZE画像を採用 | 運営者申告により確認済み | 不要（指定なし） | 360.3 KB | 39.4 KB | 800x1040 → 512x512 |
| makiba | `makiba` | 成功 | [Crazy Raccoon公式](https://crazyraccoon.jp/member/makiba/) | `public/images/streamers/makiba.webp` | 公式メンバーページのmakiba画像を採用 | 運営者申告により確認済み | 不要（指定なし） | 355.6 KB | 28.1 KB | 800x1040 → 512x512 |
| Tiramisu | `tiramisu` | 成功 | [Crazy Raccoon公式](https://crazyraccoon.jp/member/tiramisu/) | `public/images/streamers/tiramisu.webp` | 公式メンバーページのTiramisu画像を採用 | 運営者申告により確認済み | 不要（指定なし） | 424.9 KB | 35.4 KB | 800x1040 → 512x512 |
| YY | `yy` | 成功 | [Crazy Raccoon公式](https://crazyraccoon.jp/member/yy/) | `public/images/streamers/yy.webp` | 公式メンバーページのYY画像を採用 | 運営者申告により確認済み | 不要（指定なし） | 464.4 KB | 31.0 KB | 800x1040 → 512x512 |
| Zeder | `zeder` | 成功 | [Crazy Raccoon公式](https://crazyraccoon.jp/member/zeder/) | `public/images/streamers/zeder.webp` | 公式メンバーページのZeder画像を採用 | 運営者申告により確認済み | 不要（指定なし） | 477.8 KB | 35.0 KB | 800x1040 → 512x512 |
| Wokka | `wokka` | 成功 | [Crazy Raccoon公式](https://crazyraccoon.jp/member/wokka/) | `public/images/streamers/wokka.webp` | 公式メンバーページのWokka画像を採用 | 運営者申告により確認済み | 不要（指定なし） | 319.5 KB | 25.6 KB | 800x1040 → 512x512 |
| UyuRiru | `uyuriru` | 成功 | [Crazy Raccoon公式](https://crazyraccoon.jp/member/uyuriru/) | `public/images/streamers/uyuriru.webp` | 公式メンバーページのUyuRiru画像を採用 | 運営者申告により確認済み | 不要（指定なし） | 328.1 KB | 24.4 KB | 800x1040 → 512x512 |
| Toppy | `toppy` | 成功 | [Crazy Raccoon公式](https://crazyraccoon.jp/member/toppy/) | `public/images/streamers/toppy.webp` | 公式メンバーページのToppy画像を採用 | 運営者申告により確認済み | 不要（指定なし） | 485.5 KB | 35.7 KB | 800x1040 → 512x512 |
| Ruri | `ruri` | 成功 | [Crazy Raccoon公式](https://crazyraccoon.jp/member/ruri/) | `public/images/streamers/ruri.webp` | 公式メンバーページのRuri画像を採用 | 運営者申告により確認済み | 不要（指定なし） | 429.6 KB | 30.8 KB | 800x1040 → 512x512 |
| RizArt | `rizart` | 成功 | [Crazy Raccoon公式](https://crazyraccoon.jp/member/rizart/) | `public/images/streamers/rizart.webp` | 公式メンバーページのRizArt画像を採用 | 運営者申告により確認済み | 不要（指定なし） | 340.6 KB | 28.6 KB | 800x1040 → 512x512 |
| Astell | `astell` | 成功 | [Crazy Raccoon公式](https://crazyraccoon.jp/member/astell-2/) | `public/images/streamers/astell.webp` | 公式メンバーページのAstell画像を採用 | 運営者申告により確認済み | 不要（指定なし） | 358.3 KB | 24.3 KB | 800x1040 → 512x512 |
| Cornn | `cornn` | 成功 | [Crazy Raccoon公式](https://crazyraccoon.jp/member/cornn/) | `public/images/streamers/cornn.webp` | 公式メンバーページのCornn画像を採用 | 運営者申告により確認済み | 不要（指定なし） | 432.1 KB | 29.7 KB | 800x1040 → 512x512 |
| Amatsuki | `amatsuki` | 成功 | [Crazy Raccoon公式](https://crazyraccoon.jp/member/sushimaster/) | `public/images/streamers/amatsuki.webp` | 公式メンバーページのAmatsuki画像を採用 | 運営者申告により確認済み | 不要（指定なし） | 389.9 KB | 31.1 KB | 800x1040 → 512x512 |
| Alice | `alice` | 成功 | [Crazy Raccoon公式](https://crazyraccoon.jp/member/alice-2/) | `public/images/streamers/alice.webp` | 公式メンバーページのAlice画像を採用 | 運営者申告により確認済み | 不要（指定なし） | 439.5 KB | 28.2 KB | 800x1040 → 512x512 |
| ade | `ade` | 成功 | [Crazy Raccoon公式](https://crazyraccoon.jp/member/ade-2/) | `public/images/streamers/ade.webp` | 公式メンバーページのade画像を採用 | 運営者申告により確認済み | 不要（指定なし） | 316.9 KB | 24.1 KB | 800x1040 → 512x512 |

## 未取得者

- なし

## コンタクトシートと目視確認

- 全員一覧: `test-results/profile-images/contact-sheet-all.webp`
- 分割版: `test-results/profile-images/contact-sheet-1.webp` 〜 `contact-sheet-4.webp`
- 新規26人: `test-results/profile-images/new-26-contact-sheet.png`
- 既存141人と新規26人の全167人について、活動名・slug・画像を並べ、登録済み公式アカウントまたは所属公式ページとの対応を目視確認した。
- 同姓同名の別人、ファンアカウント、イベント集合写真を本人アイコンとして採用した例は確認されなかった。
- ファン太とレトルトはX画像の視認性・解像度を考慮し、本人YouTube公式チャンネルのプロフィール画像を採用した。
- Yutaponの現在のX公式アイコンは48x48pxのため低解像度だが、本人が設定したプロフィール画像を無理に拡大せず維持した。

## 権利・運用上の注意

- 許諾証跡の保管場所・許諾者・許諾日・撤回窓口は公開リポジトリ外で継続管理する。
- 表の「不要（指定なし）」は取得元の公開ページ上でクレジット指定を確認できなかったことを表す。非公開の許諾条件に指定がある場合は、公開前にJSONの `credit` へ反映する。
- X、YouTube、Twitch等でプロフィール画像が変更されても、ローカル画像は自動更新されない。更新時は本人性と許諾対象を再確認する。
- OGPへの利用は今回の許諾範囲に含めていない。OGPを追加する場合は別途明示的な許可を確認する。
- プラットフォームの表示仕様・規約変更時は、画像の継続掲載可否を再確認する。
