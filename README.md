# slack_reaction_statistics

## 使い方

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
