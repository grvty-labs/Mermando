// @flow
import Chat from './chat';
// import SlackChat from './slack-chat';
import SlackChat from './rev';
import ChannelsCreator from './channelsCreator';
import type { StoreProps as ChatProps, Actions as ChatActions } from './chat';
import type { StoreProps as SlackChatProps, Actions as SlackChatActions } from './slack-chat';

export {
  Chat,
  SlackChat,
  ChannelsCreator,
};

export type {
  ChatProps,
  ChatActions,
  SlackChatProps,
  SlackChatActions,
};
