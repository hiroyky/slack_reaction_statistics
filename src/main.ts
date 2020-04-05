import { WebClient } from '@slack/client'
import ReactionRankingService from "./service/reaction-ranking-service";
import SlackDriver from "./driver/slack-driver";
import SlackService from './service/slack-service';
import SlackCalcService from './service/slack-calc-service';
import EnvService from './service/env-service'

async function main() {
    try {
        const env = new EnvService()

        const service = new ReactionRankingService(
            new SlackService(new SlackDriver(new WebClient(), env.slackToken)),
            new SlackCalcService(),            
            );

        await service.process(env)
    } catch(err) {
        console.error(err)
        throw err
    }
}

main()