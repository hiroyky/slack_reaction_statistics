import { ConversationItem, ConversationsListResultItem, ConversationsHistoryResultItem } from "../types";

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

    public filterAvailableHistories(
        items: ConversationsHistoryResultItem[],
        excludeWords: string[]
    ) {
        return items
                .filter(i => !i.bot_id && i.user)
                .filter(i => !i.subtype)
                .filter(i => i.reactions)
                .filter(i => {
                    return excludeWords.every((e) => {
                        const re = new RegExp(e);
                        return !re.test(i.text || '')
                    })
                })
    }

    public extractTopItems(sortedItems: ConversationItem[], num: number): ConversationItem[] {
        const topItems = sortedItems.slice(0, num)
        if (topItems.length == 0 ) {
            return []
        }
        if (topItems.length == sortedItems.length) {
            return topItems
        }

        const tail = topItems[topItems.length - 1]
        const tailCount = this.calcReactionsCount(tail)

        for (let i = topItems.length; i < sortedItems.length; ++i) {
            if (this.calcReactionsCount(sortedItems[i]) === tailCount) {
                topItems.push(sortedItems[i])
            } else {
                break;
            }
        }

        return topItems
    }

    public sortByReaction(items: ConversationItem[]) {
        return items
            .sort((a, b) => {
                const aLength = this.calcReactionsCount(a)
                const bLength = this.calcReactionsCount(b)
                if(aLength < bLength) {
                    return 1
                }
                if (aLength > bLength) {
                    return -1
                }
                return 0
        })
    }

    public calcReactionsCount(item: ConversationItem): number {
        if (item.history.reactions === undefined) {
            return 0
        }
        return item.history.reactions.map(r => r.count).reduce((a, b) => a + b)
    }
}