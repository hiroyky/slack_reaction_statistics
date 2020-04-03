# slack_reaction_statistics

## 使い方

### 設定
.envファイルに設定を書きます。
```sh
cp .env.exsample .env
```

| 項目 | 概要 | 例 |
| --- | --- | --- |
| SLACK_TOKEN | APIのリクエストを許可するトークン | xoxb-xxxx.. |
| POST_CHANNEL | 投稿先のチャンネルID | C010WGM29XX |
| FROM_DAYS | 何日前からの投稿を対象にするか | 8 |
| TO_DAYS | 何日前までの投稿を対象にするか | 1 | 

例えば、FROM_DAYS=8, TO_DAYS=1で8日前から1日日前までの投稿を探索対象にできます。

### 準備
```sh
yarn install
yarn build
```

### 実行
```sh
yarn run start
```

## Slack API
### 必要な権限
いずれもbotトークンとして

- channels.join
- channels.read
- channels.history
- chat.write
- chat.write.customize

### 使用するAPIメソッド

- [conversations.list](https://api.slack.com/methods/conversations.list)
- [conversations.history](https://api.slack.com/methods/conversations.history)
- [conversations.join](https://api.slack.com/methods/conversations.join)
- [chat.postMessage](https://api.slack.com/methods/chat.postMessage)
- [chat.getPermalink](https://api.slack.com/methods/chat.getPermalink)
