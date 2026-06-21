# RTA in Japan Timer — Stream Deck plugin

NodeCG の `rtainjapan-layouts` を Stream Deck から操作するためのプラグインです（[#759](https://github.com/RTAinJapan/rtainjapan-layouts/issues/759)）。

レース中のタイマー操作（特に走者のストップ）に加え、走者ごとの完走・リタイア
（それぞれ独立したボタン）、ファンアートの「まとめて表示」開始/停止などをワン
ボタンで行えるようにし、オペレーターの負荷を下げることを目的としています。

## しくみ

- NodeCG の socket.io に接続し、`message` で `startTimer` / `stopTimer` /
  `completeRunner` / `resumeRunner` / `startTweetQueue` / `stopTweetQueue` などの
  メッセージを送信します。拡張機能側の改修は不要です。
- `timer` / `current-run` / `tweet-queue-playing` レプリカントを購読
  （ReplicantObserver）し、走者名・状態・色やファンアートの表示中/停止中を
  キーに表示します。取りこぼし対策として「再同期」アクションも用意。
- すべてのアクションは 1 つの共有 NodeCG クライアント（`src/nodecg/client.ts`）を
  介して動作します。

## アクション

| アクション                   | 動作                                     | 設定               |
| ---------------------------- | ---------------------------------------- | ------------------ |
| タイマー開始                 | `startTimer`                             | —                  |
| タイマー停止                 | `stopTimer`                              | —                  |
| ファンアート 表示開始        | `startTweetQueue`                        | —                  |
| ファンアート 表示停止        | `stopTweetQueue`                         | —                  |
| 走者 完走                    | `completeRunner {index, forfeit: false}` | 走者 index         |
| 走者 リタイア                | `completeRunner {index, forfeit: true}`  | 走者 index         |
| 走者 再開                    | `resumeRunner(index)`                    | 走者 index         |
| 走者名表示                   | 表示のみ（押下で操作なし）               | 走者 index         |
| 再同期                       | レプリカント再取得                       | —                  |
| メッセージ送信（上級者向け） | 任意の `messageName` + JSON content      | メッセージ名・内容 |

接続設定（NodeCG URL / Bundle 名 / 認証キー）は各アクションのプロパティ
インスペクターから設定でき、プラグイン全体（Global Settings）で共有されます。
既定値は `http://localhost:9090` / `rtainjapan-layouts` です。

## 開発

```sh
cd streamdeck
npm install
npm run test:types   # 型チェック
npm run build        # jp.rtainjapan.layouts.sdPlugin/bin/plugin.js を生成
npm run watch        # 変更監視ビルド
```

Stream Deck で読み込むには、[Stream Deck CLI](https://docs.elgato.com/streamdeck/cli/intro)
で `jp.rtainjapan.layouts.sdPlugin` をリンクするか、`*.streamDeckPlugin` として
パッケージします。

```sh
npx @elgato/cli link jp.rtainjapan.layouts.sdPlugin
npx @elgato/cli restart jp.rtainjapan.layouts
```

## TODO / 補足

- `imgs/` のアイコンは `tools/generate-placeholder-icons.mjs` で生成した暫定の
  単色プレースホルダーです。正式なアートに差し替えてください。
- プロパティインスペクターは `sdpi-components`（CDN）を利用しています。完全な
  オフライン運用が必要な場合はライブラリを同梱（vendoring）してください。
- 認証キーは NodeCG の `login` を有効化した環境向けの任意項目です。実運用環境の
  認証方式に合わせて `src/nodecg/client.ts` の接続オプション調整が必要な場合が
  あります。
