import SlackService from "./slack-service";
import SlackCalcService from "./slack-calc-service"

export default class ReactionRankingService {
    constructor(
        private slackService: SlackService, 
        private slackCalcService: SlackCalcService,
        ) {
    }

    public calcFromDate(nStr: string, base: Date): Date {
        const n = Number.parseInt(nStr, 10)
        if(isNaN(n)) {
            throw new Error(`${nStr} is valid number string.`)
        }

        const dt = new Date(base)
        dt.setDate(dt.getDate() - n)
        dt.setHours(0)
        dt.setMinutes(0)
        dt.setSeconds(0)
        dt.setMilliseconds(0)
        return dt
    }

    public calcToDate(nStr: string, base: Date): Date {
        const n = Number.parseInt(nStr, 10)
        if(isNaN(n)) {
            throw new Error(`${nStr} is valid number string.`)
        }

        const dt = new Date(base)
        dt.setDate(dt.getDate() - n)
        dt.setHours(23)
        dt.setMinutes(59)
        dt.setSeconds(59)
        dt.setMilliseconds(999)
        return dt
    }

    public async process(postChannel: string, from: Date, to: Date) {
        const channels = await this.slackService.getPublicAllChannels()
        await this.slackService.joinChannels(channels)

        const items = await this.slackService.getConversations(channels, from, to)
        const reactedItems = this.slackCalcService.filterHavingReactions(items)
        const result = this.slackCalcService.sortByReaction(reactedItems)
        const links = await this.slackService.getPermLinks(result.slice(0, 5))
        await this.slackService.postFeaturedPosts(postChannel, links, from, to)
    }    
}