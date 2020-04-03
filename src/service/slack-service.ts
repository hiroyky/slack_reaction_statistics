import SlackDriver from "../driver/slack-driver";
import { ConversationsListResultItem, ConversationsHistoryResultItem, ConversationItem } from "../types"
import moment from 'moment-timezone'

export default class SlackService {
    constructor(private slackDriver: SlackDriver) {}

    public async getPublicAllChannels(channels: ConversationsListResultItem[] = [], cursor = ""): Promise<ConversationsListResultItem[]> {
        const result = await this.slackDriver.getConversationList({
            exclude_archived: true,
            limit: 1000,        
            cursor,
        })

        channels.push(...(result.channels as ConversationsListResultItem[]))

        if (result.response_metadata && result.response_metadata.next_cursor) {
            return this.getPublicAllChannels(channels, result.response_metadata.next_cursor)
        }

        return channels
    }

    public async joinChannels(channels: ConversationsListResultItem[]) {
        const newChannels = channels.filter(c => !c.is_member)

        for(const c of newChannels) {
            await this.slackDriver.joinConversation({ channel: c.id, })
        }
    }

    public async getConversations(channels: ConversationsListResultItem[], from: Date, to: Date): Promise<ConversationItem[]> {
        const list = channels.filter(c => c.is_member)

        const result = new Array<ConversationItem>()

        for (const channel of list) {
            const histories = await this.getChannelConversationRecursive(channel, from, to)
            const items = histories.map(history => ({ channel, history }))
            result.push(...items)
        }

        return result
    }

    public async getChannelConversationRecursive(channel: ConversationsListResultItem, from: Date, to: Date, histories = new Array<ConversationsHistoryResultItem>(), cursor = ""): Promise<ConversationsHistoryResultItem[]> {
        const result = await this.slackDriver.getConversationHistory({
            channel: channel.id,
            limit: 1000,
            oldest: String(from.getTime() / 1000),
            latest: String(to.getTime() / 1000),
            cursor,
        })
        histories.push(...(result.messages as ConversationsHistoryResultItem[]))

        if (result.response_metadata && result.response_metadata.next_cursor) {
            return await this.getChannelConversationRecursive(channel, from, to, histories, result.response_metadata.next_cursor)
        }

        return histories
    }

    public async getPermLinks(items: ConversationItem[]) {
        const links = new Array<string>()
        for (const item of items) {
            const result = await this.slackDriver.getPermalink({ channel: item.channel.id, message_ts: item.history.ts })
            links.push(result.permalink as string)
        }

        return links
    }

    public async postFeaturedPosts(targetChannel: string, permLinks: string[], from: Date, to: Date) {
       
        const text = 
`皆さんこんにちは。
${ moment(from).format('MM日月DD日')}から${ moment(to).format('MM月DD日')}の間で、注目を集めたメッセージをお知らせします。

注目を集めたメッセージは......!!

${permLinks.join('\n')}
`

        await this.slackDriver.postMessage({
            channel: targetChannel,
            text,            
            username: '注目メッセージを探してくるマン',
        })
    }
}
