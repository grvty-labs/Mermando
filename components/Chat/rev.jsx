// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import moment from 'moment';
import { rtm as SlackRTM, channels as SlackChannels } from 'slack';
import { load as emojiLoader, parse as emojiParser } from 'gh-emoji';
import classnames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';

import { Button } from '../Button';
import { Input, FileInput } from '../Inputs';
import { Avatar } from '../User';
import {
  arraysIdentical,
  filterNewMessages,
  hasEmoji,
  decodeHtml,
  postMessage,
} from '../../js/chat/utilities';

import type { FileValue } from '../Inputs';

const DefaultComponent = () => (<div />);

type WebSocketMessage = {
  type: 'desktop_notification' | 'user_typing' | 'message' | 'channel_marked' |
    'hello',
  channel?: string,
  user?: string,
  text?: string,
  ts?: string,
  subtype: void,
}

type Channel = {
  id: string,
  name: string,
  name_normalized: string,

  created: number,
  creator: string, // User ID
  has_pins: boolean,
  is_archived: boolean,
  is_channel: true,
  is_general: boolean,
  is_member: boolean,
  is_mpim: boolean,
  is_org_shared: boolean,
  is_private: boolean,
  is_shared: boolean,
  previous_names: string[],
  priority: number,
  unlinked: number,
};

type Bot = {
  id: string,
  name: string,

  profile: void,
  app_id: string,
  deleted: boolean,
  icons: {
    emoji?: string,
    image_36?: string,
    image_48?: string,
    image_64?: string,
    image_72?: string,
  },
  updated: number,
}

type User = {
  id: string,

  deleted: boolean,
  is_app_user: boolean,
  is_bot: boolean,
  name: string,
  presence: 'away' | 'active',
  profile: {
    real_name: string,
    real_name_normalized: string,
    display_name: string,
    display_name_normalized: string,

    avatar_hash: string,
    image_24: string,
    image_32: string,
    image_48: string,
    image_72: string,
    image_192: string,
    image_512: string,
    title: string,
    phone: string,
    skype: string,

    status_emoji: string,
    status_text: string,
  },
  team_id: string,
  updated: number,
}

type Account = |
  User |
  Bot;

type MessageAttachment = {
  color: string,
  fallback: string, // Complex
  id: number,
  text: string,

  title?: string,
  footer?: string,
  title_link?: string,

  image_url?: string,
  image_bytes?: number,
  image_height?: number,
  image_width?: number,
  is_animated?: boolean,

  fields?: {
    title: string,
    short: boolean,
    value: string, // Complex
  }[],
};

type BotMessage = {
  bot_id: string,
  user: void,

  username?: string,
  attachments?: MessageAttachment[],
  icons?: {
    [key: string]: string, // Avatar
  },

  text: string, // Complex
  ts: string,
  date: moment,
  subtype: 'bot_message',
  type: 'message',
};

type BotAddMessage = {
  bot_id: string,
  user: string, // User Responsible of message ID

  username: void,
  bot_link: string,
  text: string, // Complex
  ts: string,
  date: moment,
  subtype: 'bot_add',
  type: 'message',
}

type BotRemoveMessage = {
  bot_id: string,
  user: string, // User Responsible of message ID

  username: void,
  bot_link: string,
  text: string, // Complex
  ts: string,
  date: moment,
  subtype: 'bot_remove',
  type: 'message',
}

type UserMessage = {
  user: string, // USER ID

  bot_id: string, // Bot Responsible of message ID
  username: void,
  attachments?: MessageAttachment[],
  edited?: {
    user: string,
    ts: string,
  },

  text: string, // Complex
  ts: string,
  date: moment,
  type: 'message',
  subtype: void,
};

type Message = |
  BotMessage |
  BotAddMessage |
  BotRemoveMessage |
  UserMessage;

type RTMStartPayload = {
  bots: Bot[],
  channels: Channel[],
  self: {
    id: string,
    name: string,
    created: number,
  },
  users: User[],

  cache_ts: string,
  cache_ts_version: string,
  url: string, // Websocket
}

type Props = {
  userId?: string,
  userToken?: string,
  appToken: string,
  botToken: string,
  userName?: string,
  userAvatar?: string,
  debug?: boolean,

  availableChannels?: { id: string, name: string }[],
  showChannels?: boolean,
  canAttach?: boolean,
  legend?: string,
  excludedMessageSubtypes: string[],

  components?: {
    disconnected: React.ComponentType<any>,
    emptyMessages: React.ComponentType<any>,
    invalidChannels: React.ComponentType<any>,
    login: React.ComponentType<any>,
    invalidToken: React.ComponentType<any>,
  },
}

type Default = {
  debug: boolean,
  showChannels: boolean,
  canAttach: boolean,
  legend: string,
  excludedMessageSubtypes: string[],

  components: {
    disconnected: React.ComponentType<any>,
    emptyMessages: React.ComponentType<any>,
    invalidChannels: React.ComponentType<any>,
    invalidToken: React.ComponentType<any>,
    login: React.ComponentType<any>,
  },
}

type State = {
  newMessage: string,
  messages: Message[],
  loading: boolean,
  sending: boolean,

  validToken: boolean,
  connected: boolean,
  show: boolean,
}

const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
};

export default class SlackChat extends React.Component<Props, State> {
  static defaultProps: Default = {
    debug: false,
    showChannels: true,
    canAttach: false,
    legend: 'Channels',
    excludedMessageSubtypes: [
      'channel_join',
    ],

    components: {
      disconnected: DefaultComponent,
      emptyMessages: DefaultComponent,
      invalidChannels: DefaultComponent,
      invalidToken: DefaultComponent,
      login: DefaultComponent,
    },
  }

  state: State = {
    newMessage: '',
    messages: [],
    loading: false,
    sending: false,
    show: false,

    validToken: true,
    connected: false,
  }

  componentWillMount() {
    emojiLoader().then(() => {
      this.messagesRules = {
        ...this.messagesRules,
        emoji: true,
      };
    }).catch(err => this.errorLog(`Cant initiate emoji library ${err}`));
  }

  componentDidMount() {
    this.onUpdateProps({});
  }

  componentDidUpdate(prevProps: Props) {
    this.onUpdateProps(prevProps);
  }

  componentWillUnmount() {
    if (this.activeWebsocket !== null && this.activeWebsocket.readyState !== this.activeWebsocket.CLOSED) {
      this.activeWebsocket.close();
    }
    // if (this.reloadMessagesInterval) clearInterval(this.reloadMessagesInterval);
  }

  @autobind
  onUpdateProps(prevProps: Props) {
    const { userToken } = prevProps;
    const { availableChannels, userToken: newToken } = this.props;
    if (this.active && newToken !== userToken) {
      this.debugLog('Disable previous');
      this.setState({ connected: false });

      this.active = false;
    }

    if (!this.active && newToken && availableChannels && availableChannels.length) {
      this.activeToken = newToken;
      // users.list({ token: this.activeToken }).then(console.log).catch(console.error);
      // apps.permissions.info({ token: this.activeToken }).then(console.log).catch(console.error);
      // bots.info({ token: this.activeToken }).then(console.log).catch(console.error);
      // auth.test({ token: this.activeToken }).then((data) => {
      //   this.setState({ validToken: data.ok });
      //   console.log(data);
      this.throttleConnect();
      // }).catch((data) => {
      //   this.setState({ validToken: data.ok });
      // });
    }
  }

  @autobind
  onSendNewMessage(): void {
    const {
      newMessage: text, sending, loading,
    } = this.state;
    const { userName, userAvatar } = this.props;
    if (!sending && !loading) {
      this.setState({ sending: true });
      postMessage({
        text,
        lastThreadTs: undefined,
        token: this.activeToken,
        channel: this.activeChannel.id,
        username: userName || this.activeAccount.name,
        icon_url: userAvatar,
        as_user: !userName,
      }).then(() => {
        this.setState({
          newMessage: '',
          sending: false,
        }, () => {
          // Adjust scroll height
          setTimeout(() => this.scrollDown(true), 10);
        });
      }).catch((err) => {
        if (err) {
          this.debugLog('failed to post. Err:', err);
        }
      });
    }
  }

  @autobind
  onChangeChannel(channel: Channel) {
    this.activeChannel = channel;
    this.setState({}, () => {
      this.refetchMessages();
    });
  }

  @autobind
  getAccountAvatar(account: Account): React.Node {
    // $FlowFixMe
    const { profile = undefined, icons = undefined } = account;
    let image;
    if (profile) {
      image = profile.image_24
        || profile.image_32
        || profile.image_48
        || profile.image_72
        || profile.image_192
        || profile.image_512;
    }
    if (!image && icons) {
      image = icons.image_72 || icons.image_64 ||
        icons.image_48 || icons.image_36;
    }
    if (!image) image = '';
    const name = (profile && profile.real_name) || account.name;
    return (
      <Avatar avatar={{ src: image }} name={name} />
    );
  }

  @autobind
  getAccountByID(id?: string): Account {
    let acc;
    if (id) {
      acc = this.rawUsers.find(u => u.id === id);
      if (!acc) acc = this.rawUsers.find(u => u.name === id);
      if (!acc) acc = this.rawBots.find(b => b.id === id);
    }
    if (!acc) {
      acc = {
        id: 'UNKNOWN',
        name: 'Unknown',
        app_id: 'Unknown',
        deleted: false,
        icons: {},
        updated: 0,
      };
    }

    return acc;
  }

  @autobind
  debugLog(...args: any): void {
    if (process.env.NODE_ENV !== 'production' && this.props.debug) {
      console.log('[SlackChat]', ...args);
    }
  }

  @autobind
  errorLog(...args: any): void {
    if (process.env.NODE_ENV !== 'production' && this.props.debug) {
      console.error('[SlackChat Error]', ...args);
    }
  }

  @autobind
  connectRTM() {
    const { availableChannels, userId, botToken } = this.props;
    if (!this.active) {
      SlackRTM.start({ token: botToken }).then((resp: RTMStartPayload) => {
        this.debugLog('RTM Start: ', resp);
        this.rawChannels = resp.channels;
        const [defChannelID] = availableChannels;
        const channel = this.rawChannels.find(c => c.id === defChannelID.id);
        if (channel) {
          this.rawBots = resp.bots;
          this.rawUsers = resp.users;
          this.activeChannel = channel;
          const user = this.rawUsers.find(c => c.id === userId);
          if (user) {
            this.activeAccount = user;
            this.refetchMessages();

            // SlackRTM.connect({ token: this.props.botToken }).then((response) => {
            // console.log('RTM Connect: ', response);
            this.activeWebsocket = new WebSocket(resp.url);
            this.activeWebsocket.onmessage = (e: MessageEvent) => {
              this.debugLog('WS Message: ', e);
              if (e.data) this.receiveWebsocketMessage(JSON.parse(e.data));
            };
            this.activeWebsocket.onclose = (ev) => {
              this.debugLog('WS close: ', ev);
              this.active = false;
            };
            this.activeWebsocket.onopen = (ev) => {
              this.debugLog('WS open: ', ev);
              this.active = true;
            };
            this.activeWebsocket.onerror = ev => this.errorLog('WS error: ', ev);
            // }).catch(console.error);
          }
        }
      }).catch((err) => {
        this.errorLog(err);
        this.debugLog(err.retry);
        if (err.message === 'ratelimited') {
          setTimeout(this.throttleConnect, 1000);
        }
      });
    }
  }

  @autobind
  receiveWebsocketMessage(message: Message) {
    const {
      type, subtype, channel, ts,
    } = message;
    const { excludedMessageSubtypes = [] } = this.props;
    const { messages } = this.state;
    this.debugLog('WS Message: ', message);
    switch (type) {
      case 'message':
        if (!excludedMessageSubtypes.includes(subtype)) {
          if (this.activeChannel && channel === this.activeChannel.id) {
            if (subtype === 'message_replied') this.setState({ messages: [...messages, message.message] }, this.scrollDown);
            else this.setState({ messages: [...messages, message] }, this.scrollDown);
          }
        }
        break;
      default:
        break;
    }
  }

  @autobind
  parseMessageText(text: string): React.Node {
    const linkRegex = /<\b(https?:\/\/\S+)\|(\S+)>/gi;
    const mentionRegex = /<@(.+?)>/gi;
    let decoded = decodeHtml(text);

    // Replace Slack links for HTML links
    let urlMatches = linkRegex.exec(decoded);
    while (urlMatches) {
      decoded = decoded.replace(urlMatches[0], `<a href=${urlMatches[1]} target='_blank'>${urlMatches[2]}</a>`);
      urlMatches = linkRegex.exec(decoded);
    }

    let mentionMatches = mentionRegex.exec(decoded);
    while (mentionMatches) {
      const acc = this.getAccountByID(mentionMatches[1]);
      const { profile: accprofile, name: accname } = acc;
      const displayName = accprofile && accprofile.real_name
        ? accprofile.real_name
        : accname;
      decoded = decoded.replace(mentionMatches[0], `<span class='mention'>${displayName}</span>`);
      mentionMatches = mentionRegex.exec(decoded);
    }

    // Insert emojis
    if (this.messagesRules.emoji && hasEmoji(decoded)) decoded = emojiParser(decoded);

    return (
      <div className='text' dangerouslySetInnerHTML={{ __html: decoded }} />
    );
  }

  active: boolean = false;
  activeChannel: Channel;
  activeWebsocket: ?WebSocket = null;
  activeToken: string;
  activeAccount: Account;
  messagesRules: { emoji: boolean } = {
    emoji: false,
  };
  messagesWrapper: ?any;
  rawMessages: Message[] = [];
  rawChannels: Channel[] = [];
  rawBots: Bot[] = [];
  rawUsers: User[] = [];
  throttleConnect = throttle(this.connectRTM, 3000);

  @autobind
  scrollDown(force?: boolean) {
    const { length = 0 } = this.state.messages;
    // if div is already scrolled to bottom, scroll down again just
    //   incase a new message has arrived
    const wrap = this.messagesWrapper;
    if ((wrap && force) ||
        (wrap && (length === 0 ||
                 (wrap.getScrollHeight() - wrap.getScrollTop() - wrap.getClientHeight()) < 200))) {
      wrap.scrollToBottom();
    }
  }

  @autobind
  refetchMessages() {
    const { excludedMessageSubtypes = [] } = this.props;
    this.debugLog('Load messages from channel: ', this.activeChannel);
    SlackChannels.history({
      token: this.props.appToken,
      channel: this.activeChannel.id,
    }, (err, data) => {
      if (err) {
        this.debugLog(`There was an error loading messages for ${this.activeChannel.name}. ${err} -- ${data}`);
        return;
      }
      // loaded channel history
      // Scroll down only if the stored messages and received messages are not the same
      // reverse() mutates the array
      if (!arraysIdentical(this.rawMessages, data.messages.reverse())) {
        this.debugLog('Messages loaded: ', data);
        this.rawMessages = data.messages.filter(m => !excludedMessageSubtypes.includes(m.subtype));
        this.setState({
          messages: data.messages,
          connected: true,
        }, this.scrollDown);
      }
    });
  }

  @autobind
  renderMessages(messages: Message[]): React.Node {
    let lastMessageFrom = '';
    const renderedMessages = messages.map((message) => {
      const { user, username, bot_id: bid } = message;

      let account;
      if (user) account = this.getAccountByID(user);
      else if (bid) account = this.getAccountByID(bid);
      else account = this.getAccountByID(username);

      const { id: accid, profile: accprofile, name: accname } = account;

      const mine = accid === this.activeAccount.id;

      // TODO: Return System Message
      // TODO: Return Hook Message

      const mentioned = message.text.indexOf(`@${this.activeAccount.id}`) > -1;
      const timestamp = moment(message.ts, 'X');
      const displayName = username || (accprofile && accprofile.real_name
        ? accprofile.real_name
        : accname);
      const hideHead = displayName === lastMessageFrom;
      lastMessageFrom = displayName;

      return (
        <div
          key={message.ts}
          className={classnames('msg-row', {
            mentioned, mine, 'not-mine': !mine, diff: !hideHead,
          })}
        >
          {
            hideHead
              ? <div className='avatar empty'/>
              : this.getAccountAvatar(account)
          }

          <div className='msg-cnt'>
            {
              hideHead
                ? null
                : (
                  <div className='head'>
                    <span className='name'>{displayName}</span>
                    <span className='date'>{timestamp.fromNow()}</span>
                  </div>
                )
            }
            {this.parseMessageText(message.text)}
            <div className='date'>
              <div className='tooltip'>
                {timestamp.format('LT')}
              </div>
            </div>
          </div>
        </div>
      );
    });
    return renderedMessages;
  }

  @autobind
  renderChannel({ id, name }: { id: string, name: string }) {
    const channel = this.rawChannels.find(c => c.id === id);
    if (!channel) return null;

    return (
      <Button
        key={id} size='small'
        className={id === this.activeChannel.id ? 'selected' : ''}
        onClick={() => this.onChangeChannel(channel)}
      >
        {name}
      </Button>
    );
  }

  render() {
    const {
      newMessage, messages: messagesRaw = [],
      validToken, connected, show,
      sending,
    } = this.state;
    const {
      availableChannels = [], components, userToken, legend,
      showChannels, canAttach, excludedMessageSubtypes = [],
    } = this.props;

    const messages = messagesRaw.filter(m => !excludedMessageSubtypes.includes(m.subtype));

    const enableInput = availableChannels
      && availableChannels.length
      && this.activeChannel
      && !this.activeChannel.is_archived
      && userToken
      && validToken
      && connected;
    const renderContent = !userToken
      ? <components.login />
      : !(availableChannels && availableChannels.length)
        ? <components.invalidChannels />
        : !validToken
          ? <components.invalidToken />
          : !connected
            ? <components.disconnected />
            : !(messages && messages.length)
              ? <components.emptyMessages />
              : (
                <Scrollbars
                  className='messages-wrapper'
                  ref={(vref) => { this.messagesWrapper = vref; this.scrollDown(true); }}
                >
                  { this.renderMessages(messages) }
                </Scrollbars>
              );

    return (
      <div className={classnames('chat-wrapper', { show })}>
        <div className='overlay' onClick={() => { this.setState({ show: !show }); }} />
        <div className='chat'>
          <div className='channels-wrapper'>
            <span className='legend'>{legend}</span>
            { showChannels ? availableChannels.map(this.renderChannel) : null }
          </div>

          <div className='content'>
            { renderContent }
            <Input
              id='message'
              placeholder='Write your message…'
              // editable={!this.state.sending}
              disabled={!enableInput}
              type='textarea'
              value={newMessage}
              onChange={(value: string) => { this.setState({ newMessage: value }); }}
              onKeyPress={e => (e.key === 'Enter' ? this.onSendNewMessage() : null)}
            />
            <div className='footer'>
              {
                canAttach
                  ? <Button strain='link' size='regular' disabled={!enableInput || sending}>Attach File</Button>
                  : <div />
              } 
              <Button
                strain='main'
                size='big'
                disabled={!enableInput || sending}
                onClick={this.onSendNewMessage}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
        <Button
          className='show-button'
          strain='link'
          icon='chat'
          onClick={() => { this.setState({ show: !show }); }}
        />
      </div>
    );
  }
}
