export const OPEN_MESSAGES_EVENT = 'unimarket:open-messages';
export const MESSAGES_UNREAD_EVENT = 'unimarket:messages-unread';
export const REFRESH_MESSAGES_UNREAD_EVENT = 'unimarket:refresh-messages-unread';

export type OpenMessagesDetail = {
  conversationId?: string;
};

export type MessagesUnreadDetail = {
  count: number;
};
