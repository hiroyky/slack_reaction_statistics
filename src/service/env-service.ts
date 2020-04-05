import { config } from "dotenv"

export default class EnvService {
    constructor() {
        config()
    }

    public get slackToken(): string {
        const token = process.env.SLACK_TOKEN
        if (token === undefined) {
            throw new Error(`env: SLACK_TOKEN is undefined`)
        }
        return token
    }

    public get postChannel(): string {
        const channel = process.env.POST_CHANNEL
        if (channel === undefined) {
            throw new Error(`env: POST_CHANNEL is undefined`)
        }
        return channel
    }

    public get fromDays(): number {
        return this.parseInt(process.env.FROM_DAYS)
    }

    public get toDays(): number {
        return this.parseInt(process.env.TO_DAYS)
    }

    public get numFeatures(): number {
        return this.parseInt(process.env.NUM_FEATURES)
    }

    public get includeChannels(): string[] {
        const includes = process.env.INCLUDE_CHANNELS
        if (includes === undefined) {
            return []
        }
        return includes.split(',')
    }

    public get excludeChannels(): string[] {
        const exclude = process.env.EXCLUDE_CHANNELS
        if (exclude === undefined) {
            return []
        }
        return exclude.split(',')
    }

    private parseInt(str: string | undefined) {
        if (str === undefined) {
            throw new Error()
        }
        const val = parseInt(str)
        if (isNaN(val)) {
            throw new Error(`${str} is valid number string.`)
        }
        return val
    }
}