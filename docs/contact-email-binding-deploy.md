# 問い合わせEmail Bindingの送信先固定

## 目的

公開リポジトリやブラウザへ運営者のメールアドレスを出さず、Cloudflare Email Binding `CONTACT_EMAIL`の送信先を1件に固定します。

アプリケーションは従来どおり、Runtime Secret `CONTACT_TO_EMAIL`を構造化メールの`to`へ設定します。アップロード時には、同じアドレスをCloudflare Workers BuildsのBuild Secret `CONTACT_BINDING_DESTINATION`から一時設定へ注入し、Email Binding側でも送信先を制限します。

## 安全設計

- `CONTACT_BINDING_DESTINATION`が未設定またはメール形式として不正ならアップロードしません。
- 既存の`wrangler.jsonc`を基準にし、`CONTACT_EMAIL.destination_address`だけを追加します。
- 競合する送信先制限がすでに存在する場合はアップロードを停止します。
- 一時設定はリポジトリのルートに`.wrangler.contact-binding.<一意値>.json`として作成します。
- 一時設定は`.gitignore`対象であり、`public/`や`dist/`には生成しません。
- 宛先はコマンド引数、標準出力、標準エラーへ表示しません。
- Wranglerの子プロセスには`CONTACT_BINDING_DESTINATION`を環境変数として渡しません。
- 成功時と通常のエラー時は、一時設定を`finally`で削除します。
- 実行コマンドは`wrangler versions upload`だけで、Productionへのdeployやpromoteは行いません。

## ローカル確認

実在しないテスト用アドレスを環境変数へ一時設定し、アップロードなしで検証します。

```powershell
$env:CONTACT_BINDING_DESTINATION = "contact-test@example.invalid"
npm run check:staging-config
Remove-Item Env:CONTACT_BINDING_DESTINATION
```

`check:staging-config`は一時設定の生成と制限内容を確認して削除し、外部へのアップロードを行いません。

### Windowsでの`--dry-run`について

Wrangler 4.162.0をWindowsから実行すると、公式のAstro設定である`main: "@astrojs/cloudflare/entrypoints/server"`をファイルパスとして解釈し、ビルド後でもエントリポイント未検出になることがあります。元の`wrangler.jsonc`と、このスクリプトが生成するルート直下の一時設定の両方で同じエラーになるため、送信先制限の追加が原因ではありません。

一方、`npm run build`が生成する`dist/server/wrangler.json`を使ったローカル`--dry-run`では、Workerのコンパイルと次のBindingの認識まで確認できます。

- `ASSETS`
- `CONTACT_EMAIL`
- `CONTACT_RATE_LIMITER`
- `SESSION`
- `IMAGES`

これはローカル検証用の切り分け結果です。アップロードスクリプトは、Astro公式のルート設定を基準にする既存方式を維持します。Cloudflare BuildsのLinux環境で初回実行した際は、Build logと新VersionのBindingを必ず確認してください。ローカル検証のために、`main`を旧形式のビルド成果物へ書き換えないでください。

## Cloudflare Workers Buildsの設定手順

画面名はCloudflareの更新で変わる場合があります。

1. Cloudflare Dashboardで **Workers & Pages** を開きます。
2. `streamer-age-site`を選び、**Settings** → **Build** → **Build Variables and Secrets** を開きます。
3. `CONTACT_BINDING_DESTINATION`を通常のBuild Variableではなく、暗号化される **Build Secret** として登録します。
4. 値にはRuntime Secret `CONTACT_TO_EMAIL`と同じ単一の運営者メールアドレスを入力します。
5. 値そのものをBuild log、GitHub Issue、コミット、スクリーンショットへ記録しません。
6. Build commandは`npm run build`のまま維持します。
7. Deploy commandを次へ変更します。

   ```text
   npm run upload:staging
   ```

8. 設定変更後、GitHubへpushする前に、Build Secretが登録済みであることとDeploy commandを再確認します。

設定変更中に別のBuildが起動すると、旧Deploy commandが送信先制限なしのVersionを作成する可能性があります。変更作業中は新しいpush、Buildの再実行、手動Buildを行わず、進行中のBuildがないことを先に確認してください。必要なら自動Buildを一時停止し、次の順番を守ります。

1. ローカル実装・テストを完了し、ローカルGitへコミットする。
2. `CONTACT_BINDING_DESTINATION`をBuild Secretとして登録する。
3. Deploy commandを`npm run upload:staging`へ変更する。
4. Build SecretとDeploy commandの両方を再確認する。
5. 進行中・待機中の意図しないBuildがないことを確認する。
6. 初めてGitHubへpushする。
7. 新Versionの送信先制限、全Binding、stagingエイリアス、本番トラフィックを確認する。

Build Secretが未設定なら新スクリプトはアップロード前に失敗します。制限なしBindingへフォールバックしません。ただし、Deploy commandを変更する前に旧コマンドのBuildが起動した場合はこの停止処理が働かないため、上記の切替順とBuild停止確認が必要です。

Build Secretはビルド／アップロード処理の環境だけで参照されます。Runtime Secret `CONTACT_TO_EMAIL`はWorker実行時に参照されます。役割が異なるため、両方へ同じ宛先を設定します。

## 新Versionの確認

新しいVersionが作成されたら、Secretの値を表示せず次を確認します。

1. 対象Versionがstagingエイリアスに割り当てられていること。
2. ProductionのDeploymentとトラフィック配分が変わっていないこと。
3. `CONTACT_EMAIL`のBindingに`destination_address`が存在すること。
4. `allowed_destination_addresses`が意図せず併存していないこと。
5. `CONTACT_TO_EMAIL`、`CONTACT_FROM_EMAIL`、`TURNSTILE_SECRET_KEY`など既存のRuntime Secretsが維持されていること。
6. Rate Limiter、Assets、KV、Imagesなど、他のBindingが維持されていること。

確認にはCloudflare DashboardのVersion詳細、または値をマスクした`wrangler versions view <VERSION_ID> --json`を利用します。宛先の実値をログへ出力しないでください。

`--keep-vars`が明示的に保持するのはダッシュボード管理の通常変数です。Wranglerの仕様上、Secretはアップロードで削除されませんが、`--keep-vars`だけを理由に、Cloudflare側にだけ存在するKV・Images・その他Bindingまで維持されるとは判断しません。一時設定はローカル`wrangler.jsonc`を丸ごと複製するため、そこに定義された`ASSETS`、`CONTACT_EMAIL`、`CONTACT_RATE_LIMITER`は維持されます。Astroが生成する`SESSION`と`IMAGES`、Runtime Secrets、その他のリモートBindingは、初回Versionの詳細で個別に確認してください。

## 制限が消えていた場合

1. stagingで問い合わせフォームを送信しません。
2. Productionへpromoteしません。
3. Cloudflare BuildsのDeploy commandが`npm run upload:staging`か確認します。
4. Build Secret `CONTACT_BINDING_DESTINATION`の存在を確認します。
5. Build logに`CONTACT_BINDING_DESTINATION is required; upload stopped.`または設定競合のエラーがないか確認します。
6. 原因を修正して新しいstaging Versionを作り、`destination_address`を再確認します。
7. 制限を確認できるまで、旧Production Versionとトラフィック配分を維持します。

## 注意事項

- `CONTACT_BINDING_DESTINATION`を通常のBuild Variableとして登録しないでください。
- `.wrangler.contact-binding.*.json`をGitへ追加しないでください。
- `wrangler deploy`、`wrangler versions deploy`、Production Promoteへ変更しないでください。
- 実配送試験は、送信先制限とTurnstile設定の確認後に別工程で実施します。
- `SIGINT`と`SIGTERM`では一時設定を削除しますが、プロセス強制終了やホスト障害では削除処理を実行できない場合があります。次のBuild前にルート直下の`.wrangler.contact-binding.*.json`が残っていないことを確認してください。残存ファイルはGit管理対象外ですが、宛先を含むため公開・添付せず安全に削除してください。
