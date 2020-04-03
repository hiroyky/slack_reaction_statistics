import { WebClient } from '@slack/client'
import ReactionRankingService from "./service/reaction-ranking-service";
import SlackDriver from "./driver/slack-driver";
import SlackService from './service/slack-service';
import SlackCalcService from './service/slack-calc-service';
import { config } from "dotenv"

async function main() {
    try {
        config()

        const service = new ReactionRankingService(
            new SlackService(new SlackDriver(new WebClient(), process.env.SLACK_TOKEN!)),
            new SlackCalcService(),            
            );

        const now = new Date()
        const from = service.calcFromDate(service.parseInt(process.env.FROM_DAYS), now)
        const to = service.calcToDate(service.parseInt(process.env.FROM_DAYS), now)

        await service.process(process.env.POST_CHANNEL!, from, to, service.parseInt(process.env.NUM_FEATURES))
    } catch(err) {
        console.error(err)
        throw err
    }
}

main()