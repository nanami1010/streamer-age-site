# The k4sen出演配信者の拡充調査

調査日: 2026-11-02

## 調査方針

- `src/data/streamers/` の既存120件について、活動名、別名、slug、YouTube、Twitch、Xを照合した。
- イベントへの参加は主催・出演組織・ゲーム会社の公式発表を優先した。
- 公式発表が出演予定を示すだけの場合は、実際の出演完了とは区別して「公式ロスター掲載」「出演発表」と記録した。
- 生年月日は本人または所属公式で本文まで確認できた情報だけを完全な年月日として登録した。月日しか確認できない場合は `birthMonthDay`、確認できない場合は `birthDate: null` とした。
- イベント出演歴は現行スキーマに追加せず、この報告書だけに記録した。

## 調査対象イベントと公式資料

| イベント | 公式資料 | 確認できた内容 |
| --- | --- | --- |
| League The k4sen Season: Finale（2026） | [ZETA DIVISION](https://zetadivision.com/news/2026/10/02/47674) / [特設サイト](https://league.thek4sen.com/Finale_Playoffs/) | 4チーム・3ディビジョンの公式ロスター。ZETA記事は本文を確認できた。特設サイトはブラウザ取得では本文を十分抽出できなかった。 |
| The k4sen Con 2025 | [公式サイト](https://con2025.thek4sen.com/) / [ZETA出演情報](https://zetadivision.com/news/2025/10/24/38659) / [REJECT出演情報](https://reject.jp/2025/11/04/251104/) | 出演者と一部公式SNS。開催済みイベントの出演情報として確認した。 |
| ソニックレーシング クロスワールド The k4sen（2026） | [セガ公式発表](https://prtimes.jp/main/html/rd/p/000007171.000005397.html) | 出演者12人とTwitch配信先。公式発表時点の出演情報として確認した。 |
| GeoGuessr The k4sen（2025） | [ZETA公式](https://zetadivision.com/news/2025/05/11/34026) | 調査時点で404。検索結果だけを根拠に新規登録へ使用しなかった。 |
| 過去のLeague The k4sen | [公式サイト](https://league.thek4sen.com/) | 2025年シーズンのチーム・ロール別ロスターを確認した。 |

## 既存120人との重複照合

最優先・補充候補のうち、次の人物は登録済みだったため追加していない。

| 候補表記 | 既存データでの表記・slug | 判定根拠 |
| --- | --- | --- |
| スタンミじゃぱん | `sutanmi-japan` | 活動名、Twitch、Xが一致 |
| じゃすぱー | `jasper` | 活動名、`Jasper7se`、SNSが一致 |
| Zerost | `zerost` | 活動名とSNSが一致 |
| こく兄 | `kokunii` | 別名「こくじん」とSNSが一致 |
| JapaneseKoreanUG / UG | `japanese-korean-ug` | 別名と公式SNSが一致 |
| 鈴木ノリアキ | `suzuki-noriaki` | 活動名と公式SNSが一致 |
| 焼きパン | `yakipan` | 別名 `Varvalian` とSNSが一致 |
| ta1yo | `ta1yo` | 活動名と公式SNSが一致 |
| Laz | `laz` | 活動名、`Lazvell`、SNSが一致 |
| crow | `crow` | 活動名と公式SNSが一致 |
| きなこ | `kinako` | 活動名と公式SNSが一致 |
| ありけん | `ariken` | 活動名と公式SNSが一致 |
| YUKIO / ゆきお | `yukio` | 別名と公式SNSが一致 |

新規21件については、追加後もslug、YouTube、Twitch、Xの重複が0件であることを機械的に確認した。

## 新規追加者

| 表示名 | slug | The k4sen出演情報 | 出演情報の状態 | 生年月日・誕生日 | 生年月日の根拠 |
| --- | --- | --- | --- | --- | --- |
| しゃるる | `syaruru` | LTK Finale Dahlia Diadem Masters、ソニックレーシング The k4sen | 公式ロスター・出演発表 | 未確認 | 生年・月日を一次情報で確認できず |
| たぬき忍者 | `tanuki-ninja` | LTK Finale Dahlia Diadem Masters／Nextコーチ、ソニックレーシング The k4sen | 公式ロスター・出演発表 | 未確認 | 生年・月日を一次情報で確認できず |
| らいじん | `raijin` | LTK Finale Iris Inferno Masters、ソニックレーシング The k4sen | 公式ロスター・出演発表 | 未確認 | 生年・月日を一次情報で確認できず |
| mittiii | `mittiii` | LTK Finale Iris Inferno Core | 公式ロスター掲載 | 2000-12-07 | [FENNEL公式プロフィール](https://fennel-esports.com/members/agent/2731/) に `BIRTH 2000/12/07` と明記 |
| AlphaAzur | `alpha-azur` | LTK Finale Iris Inferno Core、ソニックレーシング The k4sen | 公式ロスター・出演発表 | 04-21（月日のみ） | [UltraLMTM公式プロフィール](https://ultralmtm.com/creators/alpha-azur/) に `Birthday 4月21日` と明記 |
| たかやスペシャル | `takaya-special` | LTK Finale Iris Inferno Core、過去のLTK | 公式ロスター掲載 | 06-13（月日のみ） | [福岡ソフトバンクホークス ゲーミング公式](https://gaming.softbankhawks.co.jp/team_streamer-1/) に `誕生日 6月13日` と明記 |
| まざー3 | `mother3` | LTK Finale Dahlia Diadem Next | 公式ロスター掲載 | 1994-12-21 | 本人管理の[YouTube公式チャンネル](https://www.youtube.com/@MOTHER3rd)概要に年月日を掲載。GLOE公式も本人のTwitch・Xを照合 |
| Yutapon | `yutapon` | LTK Finale Camellia Crown Masters、過去のLTK | 公式ロスター掲載 | 1996-09-10 | [DFM公式note](https://note.com/dfmwin/n/nf7ba0a504d93) に `誕生日: 1996/9/10` と明記 |
| Ceros | `ceros` | LTK Finale Camellia Crown Masters、過去のLTK | 公式ロスター掲載 | 12-07（月日のみ） | [DFM公式note](https://note.com/dfmwin/n/n9cf606d54b21) に `誕生日：12月7日` と明記。生年は登録しない |
| Eugeo | `eugeo` | LTK Finale Iris Inferno Masters、過去のLTK | 公式ロスター掲載 | 01-23（月日のみ） | 本人の[X公式プロフィール](https://x.com/AurEugeo)では1月23日を確認できる一方、生年は競技データベース間で矛盾するため登録しない |
| Enty | `enty` | LTK Finale Iris Inferno Masters、過去のLTK | 公式ロスター掲載 | 1997-09-25 | 本人の[Twitch公式プロフィール](https://www.twitch.tv/entych/about)の自己紹介に年月日を掲載。外部テキスト抽出では内容を確認できたが、Twitch本文はJavaScript依存 |
| Day1 | `day1` | LTK Finale Dahlia Diadem Masters | 公式ロスター掲載 | 未確認 | 一次情報で確認できず |
| Killin9Hit | `killin9hit` | LTK Finale Laurel Regalia Core、The k4sen Con 2025、過去のThe k4sen | 公式ロスター・ZETA出演情報 | 1989-05-14 | [ZETA DIVISION公式プロフィール](https://zetadivision.com/players/killin9hit?PageSpeed=noscript) に `BIRTH 1989/5/14` と明記 |
| Clutch_Fi | `clutch-fi` | The k4sen Con 2025、ソニックレーシング The k4sen、過去のThe k4sen | ZETA・セガ公式出演情報 | 1992-12-11 | [ZETA DIVISION公式プロフィール](https://zetadivision.com/players/clutch_fi) に `BIRTH 1992/12/11` と明記 |
| ゆふな | `yufuna` | LTK Finale Camellia Crown Next、ソニックレーシング The k4sen | 公式ロスター・出演発表 | 未確認 | 二次資料の生年月日は採用せず |
| わしだい | `washidai` | LTK Finale Dahlia Diadem Masters／Coreコーチ | 公式ロスター掲載 | 未確認 | 一次情報で確認できず |
| hetel | `hetel` | LTK Finale Dahlia Diadem Masters | 公式ロスター掲載 | 未確認 | 大会Wiki等の年月日は採用せず |
| ハレっち | `haretti` | LTK Finale Laurel Regalia Masters | 公式ロスター掲載 | 未確認 | 一次情報で確認できず |
| Rainbrain | `rainbrain` | LTK Finale Camellia Crown Masters、過去のLTK | 公式ロスター掲載 | 未確認 | 第三者データベースの年月日は採用せず |
| なぎさっち | `nagisatti` | LTK Finale Laurel Regalia Next | 公式ロスター掲載 | 未確認 | 一次情報で確認できず |
| 夜よいち | `yoru-yoichi` | LTK シーズン: 黄昏の試練 Resolve Regalia Next | ZETA公式ロスター掲載 | 03-07（月日のみ） | 本人の[X公式プロフィール](https://x.com/YoruYoichi)に `Born March 7` と明記。生年は確認できないため登録しない |

### 役割について

LTK Finaleの公式記事はTOP/JUNGLE/MID/ADC/SUPPORTまたはCOACHの順でロスターを掲載している。上表では誤読を避けるため、JSONに役割を保存せず、公式資料上のチーム・ディビジョンまでを記録した。コーチとして明示されているたぬき忍者、わしだいはその旨を併記した。

## 公式SNS・所属の確認

| 配信者 | 確認した公式配信先・SNS | 所属の扱い |
| --- | --- | --- |
| しゃるる | [Twitch](https://www.twitch.tv/syaruru3) / [X](https://x.com/syaruruuu) | GLOE記事はSCOP参加を示すため、所属とは扱わずnull |
| たぬき忍者 | [Twitch](https://www.twitch.tv/tanukininja) / [X](https://x.com/tanukininja_jp) | 現所属の一次確認が不足したためnull |
| らいじん | [Twitch](https://www.twitch.tv/alfrea) / [X](https://x.com/Eclair08) | GLOE記事はSCOP参加を示すためnull |
| mittiii | [YouTube](https://www.youtube.com/c/mittiii) / [Twitch](https://www.twitch.tv/im_mittiii) / [X](https://x.com/mittiii) | FENNELとのエージェント契約を公式発表で確認 |
| AlphaAzur | [YouTube](https://www.youtube.com/@AlphaAzur) / [Twitch](https://www.twitch.tv/alphaazur) / [X](https://x.com/AzurAlpha) | UltraLMTM公式クリエイターページで確認 |
| たかやスペシャル | [YouTube](https://www.youtube.com/@takayaspecial) / [Twitch](https://www.twitch.tv/takayaspecial) / [X](https://x.com/PowerofTakaya) | 福岡ソフトバンクホークス ゲーミング公式で確認 |
| まざー3 | [YouTube](https://www.youtube.com/@MOTHER3rd) / [Twitch](https://www.twitch.tv/mother3rd) / [X](https://x.com/mother3rrd) | GLOEのSCOP参加は所属と扱わずnull |
| Yutapon | [Twitch](https://www.twitch.tv/yutapongo) / [X](https://x.com/yutapongo) | DFM公式の活動休止発表でストリーマー活動継続を確認 |
| Ceros | [Twitch](https://www.twitch.tv/ceros1207) / [X](https://x.com/trollceros) | 2023年のDFMコーチ情報を現在所属と断定せずnull |
| Eugeo | [YouTube](https://www.youtube.com/@Eugeoch) / [Twitch](https://www.twitch.tv/Eugeoja) / [X](https://x.com/AurEugeo) | 現所属の一次確認が不足したためnull |
| Enty | [Twitch](https://www.twitch.tv/entych) / [X](https://x.com/entyyyyyy) | 現所属の一次確認が不足したためnull |
| Day1 | [Twitch](https://www.twitch.tv/day1week) / [X](https://x.com/Day1week) | 現所属の一次確認が不足したためnull |
| Killin9Hit | [YouTube](https://www.youtube.com/@Killin9Hit) / [Twitch](https://www.twitch.tv/killin9hit) / [X](https://x.com/Killin9Hit) | ZETA DIVISION公式プロフィールで確認 |
| Clutch_Fi | [YouTube](https://www.youtube.com/@ClutchFi) / [Twitch](https://www.twitch.tv/clutch_fii) / [X](https://x.com/Clutch_Fi) | ZETA DIVISION公式プロフィールで確認 |
| ゆふな | [YouTube](https://www.youtube.com/c/YufuNachannel) / [Twitch](https://www.twitch.tv/yufuna) / [X](https://x.com/_YFNA) | 現所属の一次確認が不足したためnull |
| わしだい | [YouTube](https://www.youtube.com/@washidai) / [Twitch](https://www.twitch.tv/washidai_) / [X](https://x.com/Washidai_) | 過去所属を現在所属とせずnull |
| hetel | [YouTube](https://www.youtube.com/@hetelch) / [Twitch](https://www.twitch.tv/heteeel) / [X](https://x.com/heteel) | 過去所属を現在所属とせずnull |
| ハレっち | [Twitch](https://www.twitch.tv/haretti) / [X](https://x.com/harehare215) | 過去所属を現在所属とせずnull |
| Rainbrain | [Twitch](https://www.twitch.tv/rainbrain) | X・YouTubeは本人性を十分照合できず未登録 |
| なぎさっち | [Twitch](https://www.twitch.tv/nagisatty) / [X](https://x.com/Nagiponpoko) | 現所属の更新確認を優先しnull |
| 夜よいち | [YouTube](https://www.youtube.com/@yoruyoichi_) / [Twitch](https://www.twitch.tv/yoichi_0v0) / [X](https://x.com/YoruYoichi) | 本人YouTube概要と[ヴィレッジヴァンガード公式コラボページ](https://www.vvstore.jp/feature/detail/21882/)で3媒体を照合。現在所属は確認できないためnull |

## 追加を見送った人物

| 人物 | 理由 |
| --- | --- |
| まいたけ | 同名のVTuber・ゲーム配信者が複数見つかり、LTK出演者本人の公式アカウントを十分に照合できなかった |
| ゆにか（Yunika） | 出演ロスターは確認できたが、本人の公式配信先と継続的配信活動の照合が不足 |
| 酒寄颯馬、Yuhi、Nemoh | 競技者としての出演は確認できたが、継続的な個人配信活動と公式配信先の確認を優先して保留 |
| ごんかね、ねすてぃー、Recap、apaMEN、てぃんとん | LTK出演は確認できたが、今回追加した人物より本人公式プロフィール・SNS照合が不足 |
| 春茶 | 出演は確認できたが、主活動が音楽中心で、ゲーム配信者としての登録基準を今回は満たすと判断しなかった |
| 平岩康佑等の実況・神視点枠 | 配信者プロフィールDBへの登録適性を別途判断する必要があるため保留 |

## VTuber枠として保留

VTuber活動が中心のため、今回の拡充対象から除外した。公式ロスターには神楽めあ、天ノ川ねる、夢野あかり、白波らむね、龍巻ちせ、昏昏アリア、叶、空澄セナ、獅子堂あかり、鷹宮リオン、乾伸一郎、大御所にゅん子、千燈ゆうひ等が含まれる。将来のVTuber方針決定後に、既存データとの重複と公式プロフィールを改めて確認する。

## 出演予定と実出演の区別

- LTK Finale 2026およびソニックレーシング The k4sen 2026は、今回参照した公式資料がロスター・出演発表であるため「出演発表／公式ロスター掲載」と記録した。
- The k4sen Con 2025は開催済みで、ZETAおよびREJECTの公式出演情報を確認した。ただし全員について当日の映像まで個別に再検証したわけではない。
- GeoGuessr The k4senの指定ZETA記事は調査時点で404だったため、検索抜粋だけで出演歴を確定しなかった。

## 登録結果

- 変更前: 120人
- 新規追加: 21人
- 変更後: 141人
- 新規21人の完全な生年月日: 6人
- 新規21人の月日のみ: 5人
- 新規21人の誕生日未確認: 10人
- 全141人の完全な生年月日: 107人
- 全141人の月日のみ: 18人
- 全141人の誕生日未確認: 16人
- 新規プロフィール画像: 0件（全員 `profileImage: null`）
- 新規デバイス: 0件（全員 `devices: []`）

## 未解決事項

- Twitch・Xは外部取得時にJavaScript依存や403となることがある。本人管理プロフィールや公式組織ページで照合できたリンクを登録したが、RainbrainのX・YouTubeなどは未登録とした。
- Entyの生年月日は本人Twitchプロフィールの自己紹介に掲載されている。Twitchページ自体はブラウザ取得で本文を抽出できない環境があるため、公開前の手動ブラウザ確認を推奨する。
- Eugeoは本人Xプロフィールに「1月23日」と生年表示がある一方、第三者の競技データベースでは異なる生年が掲載されている。年は確定せず、共通する月日のみを登録した。
- まざー3の生年月日は本人YouTubeチャンネル概要を根拠にした。YouTubeの概要欄は取得環境により本文を抽出できないため、定期監査対象とする。
