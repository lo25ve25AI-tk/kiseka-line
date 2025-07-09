# キセカLINEボット

これは「キセカ」という単語に反応して、元気な妹風の返事をしてくれるシンプルなLINEボットです。

## プロジェクト概要

- **言語**: Node.js
- **フレームワーク**: Express
- **LINE SDK**: @line/bot-sdk

## デプロイまでの道のり

このボットを24時間稼働させるため、クラウドサービスへのデプロイを行いました。

1.  **クラウドサービスの選定**
    - 無料で利用でき、GitHubからの自動デプロイに対応している **Render** を選択しました。

2.  **デプロイの試行とエラーハンドリング**
    - **初回デプロイ失敗**:
        - **原因**: `package.json`内の`scripts` -> `test`の値に含まれるダブルクォーテーションがエスケープされておらず、JSONの構文エラー（`EJSONPARSE`）が発生。
        - **ログ**: `npm error JSON.parse Expected ',' or '}' after property value...`
    - **修正と再デプロイ失敗**:
        - **原因**: 構文エラーの修正時に、`"test"`というキー名の最初のダブルクォーテーションまで誤って削除してしまい、再度JSON構文エラーが発生。
        - **ログ**: `npm error JSON.parse Expected double-quoted property name...`
    - **最終的な修正と成功**:
        - `package.json`の構文を正しく修正し、GitHubにプッシュ。
        - Render側で自動デプロイが実行され、ビルドとデプロイに成功しました。

3.  **最終設定**
    - Renderで発行されたサービスURL（`https://kiseka-line.onrender.com`）の末尾に`/webhook`を付与。
    - 上記URLをLINE DevelopersコンソールのWebhook URLに設定し、全工程が完了しました。
