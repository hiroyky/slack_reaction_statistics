import { ConversationItem, ConversationsListResultItem } from "../types";

export default class SlackCalcService {
    public filterTargetChannels(allChannels: ConversationsListResultItem[], includes: string[], exclucdes: string[]): ConversationsListResultItem[] {
        return allChannels
                .filter(c => {
                    if (includes.length === 0) {
                        return true
                    }
                    return includes.find(ic => c.id == ic) !== undefined
                })
                .filter((c) => {
                    if (exclucdes.length === 0) {
                        return true
                    }
                    return exclucdes.find(ec => c.id == ec) === undefined
                })
    }

    public filterHavingReactions(items: ConversationItem[]) {
        return items
                .filter(i => !i.channel.is_private && i.channel.is_channel)
                .filter(i => !i.history.bot_id && i.history.user)
                .filter(i => !i.history.subtype)
                .filter(i => i.history.reactions)
    }

    public sortByReaction(items: ConversationItem[]) {
        return items
            .filter(i => i.history.reactions)
            .sort((a, b) => {
                const aLength = this.calcReactionsCount(a)
                const bLength = this.calcReactionsCount(b)
                if(aLength > bLength) {
                    return 1
                }
                if (bLength>aLength) {
                    return -1
                }
                return 0
        })
    }

    public extractTopItems(items: ConversationItem[], num: number): ConversationItem[] {
        const topItems = items.slice(0, num)
        if (topItems.length == 0 ) {
            return []
        }
        if (topItems.length == items.length) {
            return topItems
        }

        const tail = topItems[topItems.length - 1]
        const tailCount = this.calcReactionsCount(tail)

        for (let i = topItems.length; i < items.length; ++i) {
            if (this.calcReactionsCount(items[i]) === tailCount) {
                topItems.push(items[i])
            } else {
                break;
            }
        }

        return topItems
    }

    private calcReactionsCount(item: ConversationItem): number {
        if (item.history.reactions === undefined) {
            return 0
        }
        return item.history.reactions.map(r => r.count).reduce((a, b) => a + b)
    }
}