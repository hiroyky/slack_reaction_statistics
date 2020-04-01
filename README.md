# slack_reaction_statistics


## Slack API
### 必要な権限
いずれもbotトークンとして

- channels.join
- channels.read
- channels.history
- chat.write

### 使用するAPIメソッド

- [conversations.list](https://api.slack.com/methods/conversations.list)
- [conversations.history](https://api.slack.com/methods/conversations.history)
- [conversations.join](https://api.slack.com/methods/conversations.join)
- [chat.postMessage](https://api.slack.com/methods/chat.postMessage)
