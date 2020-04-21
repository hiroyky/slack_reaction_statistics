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
        console.log(this.getTimeStamp(), "Begin process")

        console.log(this.getTimeStamp(), "gathergin channel list...")
        const channels = await this.slackService.getPublicAllChannels()
        const targetChannels = this.slackCalcService.filterTargetChannels(channels, env.includeChannels, env.excludeChannels)
        console.log(this.getTimeStamp(), `found: ${channels.length} channels, target: ${targetChannels.length} channels`)

        console.log(this.getTimeStamp(), "joining channels which bot do't still join....")
        const newCount = await this.slackService.joinChannels(targetChannels)
        console.log(this.getTimeStamp(), `joined ${newCount} channels.`)

        const now = new Date()
        const from = this.calcFromDate(env.fromDays, now)
        const to = this.calcFromDate(env.toDays, now)

        console.log(this.getTimeStamp(), "gathering conversation items...")
        const items = await this.slackService.getConversations(targetChannels, from, to)
        console.log(this.getTimeStamp(), `gatherd ${items.length} items`)
        const reactedItems = this.slackCalcService.filterHavingReactions(items)
        const result = this.slackCalcService.sortByReaction(reactedItems)
        const links = await this.slackService.getPermLinks(this.slackCalcService.extractTopItems(result, env.numFeatures))
        console.log(links)
        //await this.slackService.postFeaturedPosts(env.postChannel, links, from, to)
    }    

    private getTimeStamp(){
        return new Date().getTime() / 1000
    }
}
