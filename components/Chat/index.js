// @flow
import Chat from './chat';
import SlackChat from './slack-chat';
import type { StoreProps as ChatProps, Actions as ChatActions } from './chat';
import type { StoreProps as SlackChatProps, Actions as SlackChatActions } from './slack-chat';

export {
  Chat,
  SlackChat,
};

export type {
  ChatProps,
  ChatActions,
  SlackChatProps,
  SlackChatActions,
};
