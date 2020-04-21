import SlackService from "./slack-service";
import SlackCalcService from "./slack-calc-service"
import EnvService from "./env-service";

export default class ReactionRankingService {
    constructor(
        private slackService: SlackService, 
        private slackCalcService: SlackCalcService,
        ) {
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

    public async process(env: EnvService) {
        const channels = await this.slackService.getPublicAllChannels()
        const targetChannels = this.slackCalcService.filterTargetChannels(channels, env.includeChannels, env.excludeChannels)
        await this.slackService.joinChannels(targetChannels)

        const now = new Date()
        const from = this.calcFromDate(env.fromDays, now)
        const to = this.calcFromDate(env.toDays, now)

        const items = await this.slackService.getConversations(targetChannels, from, to)
        const reactedItems = this.slackCalcService.filterHavingReactions(items)
        const result = this.slackCalcService.sortByReaction(reactedItems)
        const links = await this.slackService.getPermLinks(this.slackCalcService.extractTopItems(result, env.numFeatures))
        await this.slackService.postFeaturedPosts(env.postChannel, links, from, to)
    }    
}