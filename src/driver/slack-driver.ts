import { 
    WebClient, 
    ChatPostMessageArguments, 
    ConversationsListArguments, 
    ConversationsHistoryArguments, 
    ConversationsJoinArguments 
} from '@slack/client'

export default class SlackDriver {

    constructor(private client: WebClient) {}

    public getConversationList(arg: ConversationsListArguments) {
        try {
            return this.client.conversations.list(arg)
        } catch(err) {
            console.error(err)
        }
    }

    public getConversationHistory(arg: ConversationsHistoryArguments) {
        try {
            return  this.client.conversations.history(arg)
        } catch(err) {
            console.error(err)
        }
    }

    public joinConversation(arg: ConversationsJoinArguments) {
        try {
            return this.client.conversations.join(arg)
        } catch(err) {
            console.error(err)
        }
    }

    public async postMessage(arg: ChatPostMessageArguments) {
        try {
            return this.client.chat.postMessage(arg)
        } catch(err) {
            console.error(err)
        }
    }

}