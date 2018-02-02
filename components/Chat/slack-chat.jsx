// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import { rtm, channels } from 'slack';
import { load as emojiLoader, parse as emojiParser } from 'gh-emoji';
import classNames from 'classnames';
import { Button } from '../Button';
import { Input, FileInput } from '../Inputs';
import {
  wasIMentioned, decodeHtml, postMessage,
  postFile, getNewMessages, hasEmoji,
  hasAttachment, isSystemMessage, isAdmin,
} from '../../js/chat/chat-functions';

// Utils
import { debugLog, arraysIdentical } from '../../js/chat/utils';
import User from '../../js/chat/User';

// Hooks
import { isHookMessage, execHooksIfFound } from '../../js/chat/hooks';

// Themes
import { changeColorRecursive } from '../../js/chat/themes';
import type { FileValue } from '../Inputs';

type Channel = {
  id: number | string,
  name: string,
  connection: string,
  legend: string,
};

export type StoreProps = {
  apiToken: string,
  channels: Channel[],
  botName?: string,
  helpText?: string,
  // bypass the channel list and go directly to a specific channel
  defaultChannel?: string,
  themeColor?: string,
  userImage?: string,
  hooks?: any[],
  debugMode?: boolean
};
export type Actions = {};
type Props = StoreProps & Actions;
type Default = {
  debugMode: boolean,
};
type State = {
  // selectedChannel: number | string,
  helpText: string,
  postMyMessage: string,
  sendingLoader: boolean,
  failed: boolean,
  postMyFile?: FileValue,
  fileUploadLoader: boolean,
  userThreadTss: any[],
  onlineUsers: any[],
  channels: any[],
  messages: any[],
};

export default class SlackChat extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    hooks: [],
    debugMode: false,
  };
  constructor(props: Props) {
    super(props);
    this.bot = rtm.client();
    this.apiToken = atob(this.props.apiToken);
    this.refreshTime = 2000;
    this.chatInitiatedTs = '';
    this.activeChannel = [];
    this.activeChannelInterval = null;
    this.messageFormatter = {
      emoji: false, // default
    };
    this.fileUploadTitle = `Posted by ${this.props.botName}`;
    this.themeDefaultColor = '#2e7eea'; // Defined as $theme_color sass variable in .scss
    // Initiate Emoji Library
    emojiLoader().then(() => {
      this.messageFormatter = {
        emoji: true,
      };
    }).catch(err => debugLog(`Cant initiate emoji library ${err}`));
    // Connect bot
    this.connectBot(this).then((data) => {
      debugLog('got data', data);
      if (this.props.defaultChannel) {
        this.activeChannel = data.channels.filter(channel => channel.name === this.props.defaultChannel)[0];
      }
      this.setState({
        onlineUsers: data.onlineUsers,
        channels: data.channels,
      });
    }).catch((err) => {
      debugLog('could not intialize slack bot', err);
      this.setState({
        failed: true,
      });
    });
  }

  state: State = {
    helpText: this.props.helpText || '',
    fileUploadLoader: false,
    postMyMessage: '',
    sendingLoader: false,
    failed: false,
    userThreadTss: [],
    onlineUsers: [],
    channels: [],
    messages: [],
  };

  componentDidMount() {
    if (this.props.themeColor) {
      changeColorRecursive(document.body, this.themeDefaultColor, this.props.themeColor);
    }
  }

  @autobind
  getUserImg(message) {
    return null;
    const userId = message.user || message.username;
    let image;
    this.state.onlineUsers.map((user) => {
      if (user.id === userId) {
        image = user.image;
      }
    });
    const imageToReturn = image
      ? // Found backend user
        <img src={image} className='contact__photo' alt='mentionedUserImg' />
      : (
        // Check admin or client user?
        isAdmin(message)
          ? <img src={`https://robohash.org/${userId}?set=set2`} className='contact__photo' alt={userId} />
          : (
            // Check system message or client user?
            isSystemMessage(message)
              ? <img src={`https://robohash.org/${userId}?set=set3`} className='contact__photo' alt={userId} />
              : // Regular browser client user
              <img src={`https://robohash.org/${userId}`} className='contact__photo' alt={userId} />
          )
      );
    return imageToReturn;
  }

  @autobind
  displayFormattedMessage(message) {
    // decode formatting from messages text to html text
    const messageText = decodeHtml(message.text);
    // who's message is this?
    const myMessage = message.username === this.props.botName;
    // Check to see if this is a Slack System message?
    if (isSystemMessage(message)) {
      // message.text is a system message
      // try to see if it has an attachment in it
      const attachmentFound = hasAttachment(message.text);
      if (attachmentFound && attachmentFound[0]) {
        // An attachment is found
        // Point to file available for download
        if (attachmentFound[1]) {
          // image file found
          const didIPostIt = message.text.indexOf(this.fileUploadTitle) > -1;
          const fileNameFromUrl = attachmentFound[1].split('/');
          return (
            <div
              className={classNames('msgRow', didIPostIt ? 'mine' : 'notMine')}
              key={message.ts}
            >
              {
                didIPostIt
                // show customer image
                  ? <img src={this.props.userImage} className='user__contact__photo' alt='userIcon' />
                  : null
              }
              <div className={classNames('chat__message', didIPostIt ? 'mine' : 'notMine')}>
                <strong>Sent an Attachment: </strong>
                <span>{fileNameFromUrl[fileNameFromUrl.length - 1]}</span>
                <hr />
                <a href={attachmentFound[1]} target='_blank'>
                  <span>Click to Download</span>
                </a>
              </div>
              {
                // Show remote users image only if message isn't customers
                !didIPostIt
                  ? this.getUserImg(message)
                  : null
              }
            </div>
          );
        }
      }
      // else we display a system message that doesn't belong to
      // anyone
      return (
        <div className={classNames('msgRow')} key={message.ts}>
          <div
            className={classNames('message', 'system__message')}
            dangerouslySetInnerHTML={{ __html: messageText }}
          />
        </div>
      );
    }
    // Check to see if this is a hookMessage
    // If yes, we do not display it
    if (isHookMessage(messageText)) {
      return null;
    }
    // check if user was mentioned by anyone else remotely
    const mentioned = wasIMentioned(message, this.props.botName);
    const textHasEmoji = hasEmoji(messageText);
    // check if emoji library is enabled
    if (this.messageFormatter.emoji && textHasEmoji) {
      // parse plain text to emoji
      // NOTE: messageText = emojiParser(messageText);
    }
    return (
      <div className={classNames('msgRow', myMessage ? 'mine' : 'notMine')} key={message.ts}>
        {
          myMessage
          // show customer image
            ? <img src={this.props.userImage} className='user__contact__photo' alt='userIcon' />
            : null
        }
        {
          textHasEmoji
          // dangerouslySetInnerHTML only if text has Emoji
            ? (
              <div
                className={classNames('message', mentioned ? 'mentioned' : '')}
                dangerouslySetInnerHTML={{ __html: messageText }}
              />
            )
              // else display it normally
            : (
              <div className={classNames('message', mentioned ? 'mentioned' : '')}>
                {messageText}
              </div>
            )
        }
        {
          // Show remote users image only if message isn't customers
          !myMessage
            ? this.getUserImg(message)
            : null
        }
      </div>
    );
  }

  @autobind
  isValidOnlineUser(user) {
    // return true if
    // user should be active / online
    // user.presence === 'active' &&
    return !user.is_bot;
    // And is NOT a bot
    // slackbot hack, it thinks its not a bot :/
    // && user.name.indexOf('slackbot') === -1;
  }

  @autobind
  connectBot() {
    return new Promise((resolve: Function, reject: Function) => {
      try {
        // start the bot, get the initial payload
        this.bot.started((payload) => {
          debugLog(payload);
          // Create new User object for each online user found
          // Add to our list only if the user is valid
          const onlineUsers = [];
          // extract and resolve return the users
          payload.users.map(user => (this.isValidOnlineUser(user)
            ? onlineUsers.push(new User(user))
            : null));
          // get the channels we need
          const channels = [];
          payload.channels.map((channel) => {
            this.props.channels.forEach((channelObject) => {
              // If this channel is exactly as requested
              if (channelObject.name === channel.name || channelObject.id === channel.id) {
                if (this.props.defaultChannel === channel.name) {
                  this.activeChannel = channelObject;
                }
                // NOTE: channel.icon = channelObject.icon; // Add on the icon property to the channel list
                channels.push(channel);
              }
            });
          });
          return resolve({ channels, onlineUsers });
        });
        // tell the bot to listen
        this.bot.listen({ token: this.apiToken }, (err) => {
          if (err) {
            debugLog`Could not connect to Slack Server. Reason: ${JSON.stringify(err)}`;
            this.setState({
              helpText: 'Slack Connection Error!',
            });
          }
        });
      } catch (err) {
        return reject(err);
      }
    });
  }

  @autobind
  postMyMessage() {
    return postMessage({
      text: this.state.postMyMessage,
      lastThreadTs: this.state.userThreadTss[this.state.userThreadTss.length - 1],
      apiToken: this.apiToken,
      channel: this.activeChannel.id,
      username: this.props.botName,
    }).then((data) => {
      this.setState({
        postMyMessage: '',
        sendingLoader: false,
      }, () => {
        // Adjust scroll height
        setTimeout(() => {
          const chatMessages = document.getElementById('widget-reactSlakChatMessages');
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }, this.refreshTime);
      });
      return this.forceUpdate();
    })
      .catch((err) => {
        if (err) {
          return debugLog('failed to post. Err:', err);
        }
        return null;
      });
  }

  @autobind
  loadMessages(channel: Channel) {
    const that = this;
    if (!this.chatInitiatedTs) {
      this.chatInitiatedTs = Date.now() / 1000;
    }
    // define loadMessages function
    const getMessagesFromSlack = () => {
      const messagesLength = that.state.messages.length;
      channels.history({
        token: this.apiToken,
        channel: channel.id,
      }, (err, data) => {
        if (err) {
          debugLog(`There was an error loading messages for ${channel.name}. ${err}`);
          return this.setState({
            failed: true,
          });
        }
        // loaded channel history
        debugLog('got data', data);
        // Scroll down only if the stored messages and received messages are not the same
        // reverse() mutates the array
        if (!arraysIdentical(this.state.messages, data.messages.reverse())) {
          // Got new messages
          // We dont wish to execute action hooks if user opens chat for the first time
          if (this.state.messages.length !== 0) {
            // Execute action hooks only if they are really new messages
            // We know they are really new messages by checking to see if we already have messages in the state
            // Only if we atleast have some messages in the state
            // Grab new messages
            const newMessages = getNewMessages(this.state.messages, data.messages);
            // Iterate over the new messages and exec any action hooks if found
            if (newMessages) {
              newMessages.forEach(message => execHooksIfFound({
                message,
                username: this.props.botName,
                customHooks: this.props.hooks,
                apiToken: this.apiToken,
                channel: this.activeChannel.id,
              }));
            }
          }
          // set the state with new messages
          that.messages = data.messages;
          // NOTE: if (this.props.singleUserMode) {
          //   if (that.messages.length > 0) {
          //     that.messages = that.messages.filter(
          //       (message) =>
          //       {
          //         if (message.username === that.props.botName) {
          //           if (message.thread_ts) {
          //             this.state.userThreadTss.indexOf(message.thread_ts) === -1 ? this.state.userThreadTss.push(message.thread_ts) : null;
          //           }
          //           return true;
          //         }
          //         if (this.state.userThreadTss.indexOf(message.thread_ts) !== -1) {
          //           return true;
          //         }
          //         return false;
          //       }
          //     );
          //   } else {
          //     that.messages = [];
          //   }
          // }

          // NOTE: if (this.props.defaultMessage) {
          //   // add timestamp so list item will have unique key
          //   that.messages.unshift({text: this.props.defaultMessage, ts: this.chatInitiatedTs});
          // }
          return this.setState({
            messages: that.messages,
          }, () => {
            // if div is already scrolled to bottom, scroll down again just incase a new message has arrived
            const chatMessages = document.getElementById('widget-reactSlakChatMessages');
            chatMessages.scrollTop = (chatMessages.scrollHeight < chatMessages.scrollTop + 600 ||
              messagesLength === 0)
              ? chatMessages.scrollHeight
              : chatMessages.scrollTop;
          });
        }
      });
    };
    // Call it once
    getMessagesFromSlack();
    // Set the function to be called at regular intervals
    // get the history of channel at regular intevals
    this.activeChannelInterval = setInterval(getMessagesFromSlack, this.refreshTime);
  }

  activeChannel: Channel;
  activeChannelInterval: any;
  apiToken: any;
  bot: any;
  chatInitiatedTs: any;
  fileUploadTitle: string;
  messageFormatter: any;
  refreshTime: number;
  themeDefaultColor: string;

  @autobind
  handleFileChange(file: FileValue) {
    debugLog('Going to upload', file);
    return this.setState({
      postMyFile: file,
      // show the loader
      fileUploadLoader: true,
      // Upload file in callback of this setstate
    }, () => postFile({
      file,
      title: this.fileUploadTitle,
      apiToken: this.apiToken,
      channel: this.activeChannel.id,
    }).then(() => this.setState({
      // Upload is done, once this callback is hit
      // We can take off the value and hide the loader
      postMyFile: undefined,
      fileUploadLoader: false,
    })).catch((err) => {
      debugLog('Could not post file', err);
    }));
  }

  @autobind
  openChannel(channel: Channel) {
    // stop propagation so we can prevent any other click events from firing
    this.activeChannel = channel;
    this.setState({}, () => this.loadMessages(channel));
    // Set this channel as active channel
  }

  @autobind
  renderChannel(channel: Channel, index: number) {
    return (
      <Button
        key={channel.id} size='small'
        className={index === 0 ? 'selected' : ''}
        onClick={() => this.openChannel(channel)}
      >
        {channel.name}
      </Button>
    );
  }

  render() {
    const {
      postMyMessage, failed, messages, postMyFile, helpText, channels: stateChannels,
    } = this.state;

    if (failed) {
      return false;
    }

    return (
      <div className='chat-wrapper'>
        <div className='chat'>

          <div className='channels-wrapper'>
            <span>{helpText}</span>
            <span className='legend'>Channels</span>
            { stateChannels.map(this.renderChannel) }
          </div>

          <div className='content'>
            {/* <span className='legend'>{stateChannels[0].legend}</span> */}
            <div className='messages-wrapper'>
              { messages.map(message => this.displayFormattedMessage(message)) }
            </div>
            <div>
              {
                this.state.fileUploadLoader
                  ? (
                    <div>
                      <span>Uploading</span>
                    </div>
                  )
                  : null
              }
            </div>

            {/* {
              !this.state.fileUploadLoader
                ? (
              <FileInput
              id='uploader'
              type='single'
              value={postMyFile}
              onChange={this.handleFileChange}
              />
                )
                : null
            } */}
            <Input
              id='message'
              placeholder='Write your message…'
              type='textarea'
              value={postMyMessage}
              onChange={(value: string) => { this.setState({ postMyMessage: value }); }}
              onKeyPress={e => (e.key === 'Enter' ? this.postMyMessage() : null)}
            />
            <div className='footer'>
              <Button strain='link' size='regular'>Attach File</Button>
              <Button strain='main' size='big'>Send</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
