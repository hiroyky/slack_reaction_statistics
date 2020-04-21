import { 
    WebClient, 
    ChatPostMessageArguments, 
    ConversationsListArguments, 
    ConversationsHistoryArguments, 
    ConversationsJoinArguments,
    ChatGetPermalinkArguments, 
} from "@slack/client"

export default class SlackDriver {
    constructor(
        private client: WebClient, 
        private token: string,
    ) {}

    public async getConversationList(arg: ConversationsListArguments) {
        try {
            arg.token = this.token
            const result = await this.client.conversations.list(arg)
            if (!result.ok) {
                throw result.error
            }
            return result
        } catch(err) {
            console.error(err)
            throw err
        }
    }

    public async getConversationHistory(arg: ConversationsHistoryArguments) {
        try {
            arg.token = this.token
            return  await this.client.conversations.history(arg)
        } catch(err) {
            console.error(err)
            throw err
        }
    }

    public async joinConversation(arg: ConversationsJoinArguments) {
        try {
            arg.token = this.token
            return await this.client.conversations.join(arg)
        } catch(err) {
            console.error(err)
            throw err
        }
    }

    public async getPermalink(arg: ChatGetPermalinkArguments) {
        try {
            arg.token = this.token
            return await this.client.chat.getPermalink(arg)
        } catch(err) {
            console.error(err)
            throw err
        }
    }

    public async postMessage(arg: ChatPostMessageArguments) {
        try {
            arg.token = this.token
            return await this.client.chat.postMessage(arg)
        } catch(err) {
            console.error(err)
            throw err
        }
    }
}