import SlackDriver from "../driver/slack-driver";
import { ConversationsListResultItem, ConversationsHistoryResultItem, ConversationItem } from "../types"
import moment from 'moment-timezone'
import SlackCalcService from "./slack-calc-service";

export default class SlackService {
    constructor(private slackDriver: SlackDriver, private calcService = new SlackCalcService()) {}    

    public async getPublicAllChannels(channels: ConversationsListResultItem[] = [], cursor = ""): Promise<ConversationsListResultItem[]> {
        await this.wait()

        const result = await this.slackDriver.getConversationList({
            exclude_archived: true,
            limit: 1000,        
            cursor,
        });

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
            await this.wait()
        }
        return newChannels.length
    }

    public async getTheMostReactedConversations(channels: ConversationsListResultItem[], from: Date, to: Date, topNum: number): Promise<ConversationItem[]> {
        const list = channels.filter(c => c.is_member)

        const result = new Array<ConversationItem>()

        for (const channel of list) {
            console.log('channel', channel.id, channel.name)
            await this.getChannelTheMostConversationRecursive(channel, from, to, topNum, result)
            await this.wait()
        }

        return result
    }

    public async getChannelTheMostConversationRecursive(channel: ConversationsListResultItem, from: Date, to: Date, topNum: number, dest: Array<ConversationItem>, cursor = ""): Promise<void> {
        await this.wait()
        
        const result = await this.slackDriver.getConversationHistory({
            channel: channel.id,
            limit: 1000,
            oldest: String(from.getTime() / 1000),
            latest: String(to.getTime() / 1000),
            cursor,
        })
        const messgaes = this.calcService.filterAvailableHistories(result.messages as ConversationsHistoryResultItem[]).map(history => ({history,channel}))
        const reactedMessages = messgaes.filter(m => this.calcService.calcReactionsCount(m) > 0)
        const topMessages = this.calcService.extractTopItems(this.calcService.sortByReaction(reactedMessages), topNum)

        dest.push(...(topMessages))
        dest = this.calcService.extractTopItems(this.calcService.sortByReaction(dest), topNum)

        console.log(dest.map(h => ({
            c: this.calcService.calcReactionsCount(h), 
            id: h.history.ts, 
            ch:h.channel.id + ' ' + h.channel.name,
        })))

        if (result.response_metadata && result.response_metadata.next_cursor && result.response_metadata.next_cursor.length > 0) {
            console.log(cursor, result.response_metadata.next_cursor, cursor === result.response_metadata.next_cursor)
            return await this.getChannelTheMostConversationRecursive(channel, from, to, topNum, dest, result.response_metadata.next_cursor)
        }
    }

    public async getPermLinks(items: ConversationItem[]) {
        const links = new Array<string>()
        for (const item of items) {
            const result = await this.slackDriver.getPermalink({ channel: item.channel.id, message_ts: item.history.ts })
            links.push(result.permalink as string)
            await this.wait()
        }

        return links
    }

    public async postFeaturedPosts(targetChannel: string, permLinks: string[], from: Date, to: Date) {
        await this.wait()

        const text = 
`皆さんこんにちは。
${ moment(from).format('MM日月DD日')}から${ moment(to).format('MM月DD日')}の間で、注目を集めたメッセージをお知らせします。

注目を集めたメッセージは......!!
`

        await this.slackDriver.postMessage({
            channel: targetChannel,
            text,            
            username: '注目メッセージを探してくるマン',
        })

        for (const link of permLinks) {
            await this.wait()
            await this.slackDriver.postMessage({
                channel: targetChannel,
                text: link,
                username: '注目メッセージを探してくるマン',
            })
        }
    }

    private wait() {
        return new Promise(resolve => setTimeout(resolve, 1000))
    }
}
