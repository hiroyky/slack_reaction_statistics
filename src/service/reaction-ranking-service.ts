import SlackService from "./slack-service";
import SlackCalcService from "./slack-calc-service"

export default class ReactionRankingService {
    constructor(
        private slackService: SlackService, 
        private slackCalcService: SlackCalcService,
        ) {
    }

    public parseInt(str: string | undefined): number {
        if (str === undefined) {
            throw new Error('str is undefined')
        }
        const val = Number.parseInt(str, 10)
        if(isNaN(val)) {
            throw new Error(`${str} is valid number string.`)
        }

        return val
    }

    public calcFromDate(n: number, base: Date): Date {
        const dt = new Date(base)
        dt.setDate(dt.getDate() - n)
        dt.setHours(0)
        dt.setMinutes(0)
        dt.setSeconds(0)
        dt.setMilliseconds(0)
        return dt
    }

    public calcToDate(n: number, base: Date): Date {
        const dt = new Date(base)
        dt.setDate(dt.getDate() - n)
        dt.setHours(23)
        dt.setMinutes(59)
        dt.setSeconds(59)
        dt.setMilliseconds(999)
        return dt
    }

    public async parseExcludeChannel() {
        
    }

    public async process(postChannel: string, from: Date, to: Date, numFeatures: number) {
        const channels = await this.slackService.getPublicAllChannels()
        await this.slackService.joinChannels(channels)

        const items = await this.slackService.getConversations(channels, from, to)
        const reactedItems = this.slackCalcService.filterHavingReactions(items)
        const result = this.slackCalcService.sortByReaction(reactedItems)
        const links = await this.slackService.getPermLinks(result.slice(0, numFeatures))
        await this.slackService.postFeaturedPosts(postChannel, links, from, to)
    }    
}