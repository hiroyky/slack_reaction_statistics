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

    public get fromDays(): number {
        return this.parseInt(process.env.FROM_DAYS)
    }

    public get toDays(): number {
        return this.parseInt(process.env.TO_DAYS)
    }

    public get numFeatures(): number {
        return this.parseInt(process.env.NUM_FEATURES)
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