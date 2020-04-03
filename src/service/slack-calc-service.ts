import { ConversationItem } from "../types";

export default class SlackCalcService {
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
                const aLength = a.history.reactions!.map(r => r.count).reduce((a, b) => a + b)
                const bLength = b.history.reactions!.map(r => r.count).reduce((a, b) => a + b)
                if(aLength > bLength) {
                    return 1
                }
                if (bLength>aLength) {
                    return -1
                }
                return 0
        })
    }
}