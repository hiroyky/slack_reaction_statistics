import SlackService from "./slack-service";
import SlackCalcService from "./slack-calc-service"
import EnvService from "./env-service";
import moment from 'moment-timezone'

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
        const now = new Date()
        const from = this.calcFromDate(env.fromDays, now)
        const to = this.calcFromDate(env.toDays, now)
        console.log(`${ moment(from).format('MM日月DD日')}から${ moment(to).format('MM月DD日')}`)

        console.log(this.getTimeStamp(), "Begin process")

        console.log(this.getTimeStamp(), "gathergin channel list...")
        const channels = await this.slackService.getPublicAllChannels()
        const targetChannels = this.slackCalcService.filterTargetChannels(channels, env.includeChannels, env.excludeChannels)
        console.log(this.getTimeStamp(), `found: ${channels.length} channels, target: ${targetChannels.length} channels`)

        console.log(this.getTimeStamp(), "joining channels which bot do't still join....")
        const newCount = await this.slackService.joinChannels(targetChannels)
        console.log(this.getTimeStamp(), `joined ${newCount} channels.`)

        console.log(this.getTimeStamp(), "gathering conversation items...")
        const items = await this.slackService.getTheMostReactedConversations(targetChannels, from, to, env.numFeatures)
        console.log(this.getTimeStamp(), `gatherd ${items.length} items`)
        const links = await this.slackService.getPermLinks(this.slackCalcService.extractTopItems(items, env.numFeatures))
        console.log(links)
        await this.slackService.postFeaturedPosts(env.postChannel, links, from, to)
    }    

    private getTimeStamp(){
        return new Date().getTime() / 1000
    }
}
