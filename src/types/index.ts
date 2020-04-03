export interface ConversationsListResultItem {
    id: string;
    name: string;
    is_channel: boolean;
    is_group: boolean;
    is_im: boolean;
    is_archived: boolean;
    is_member: boolean;
    is_private: boolean;   
    num_members: number; 
}

export interface ConversationsHistoryResultItem {
    type: string;
    subtype?: string;
    text?: string;
    ts: string;
    username: string;

    user?: string;
    bot_id?: string;

    reactions?: Array<{
        count: number;
    }>;
}

export interface ConversationItem {
    channel: ConversationsListResultItem;
    history: ConversationsHistoryResultItem;
}