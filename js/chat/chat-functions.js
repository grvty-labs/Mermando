// @flow
import { chat } from 'slack';
import { debugLog } from './utils';

type File = {
  file: {
    name: string
  },
  title: string,
  apiToken: string,
  channel: string,
};

type Message = {
  user?: string | number,
  username: string,
  text: string,
  ts: string,
};

type PostMessage = {
  user?: string | number,
  username?: string,
  text: string,
  lastThreadTs?: string,
  token: string,
  channel: string | number,
  as_user?: boolean,
};

export const postMessage: (x: PostMessage) => Promise<*> = ({
  text,
  lastThreadTs,
  token,
  channel,
  username,
  as_user,
}) => new Promise((resolve: Function, reject: Function) => {
  if (text !== '') {
    const msg = {
      token, channel, text, as_user,
    };
    if (lastThreadTs) msg.thread_ts = lastThreadTs;
    if (username) msg.username = username;
    return chat.postMessage(msg, (err, data) => (err ? reject(err) : resolve(data)));
  }
});

export const postFile: (x: File) => Promise<*> = ({
  file,
  title,
  apiToken,
  channel,
}) => new Promise((resolve: Function, reject: Function) => {
  debugLog('UPLOADING', file);
  const options = {
    token: apiToken,
    title,
    filename: file.name,
    filetype: 'auto',
    channels: channel,
  };
  const form = new FormData();
  form.append('token', options.token);
  form.append('filename', options.filename);
  form.append('title', options.title);
  form.append('filetype', options.filetype);
  form.append('channels', options.channels);
  form.append('file', new Blob([file]));
  const request = new XMLHttpRequest();
  request.open('POST', 'https://slack.com/api/files.upload');
  request.send(form);
  request.onload = () => {
    if (request.status !== 200) {
      const error = new Error('There was an error uploading the file. Response:', request.status, request.responseText);
      return reject(error);
    }
    return resolve();
  };
});

export function getNewMessages<T>(old: T[], total: T[]): T[] {
  const oldText = JSON.stringify(old);
  // Message Order has to be consistent
  const differenceInMessages = total.filter((i) => {
    if (oldText.indexOf(JSON.stringify(i)) === -1) {
      return i;
    }
    return false;
  });
  return differenceInMessages;
}

export const isSystemMessage: (x: Message) => boolean = (message) => {
  const systemMessageRegex = /<@.[^|]*[|].*>/;
  return systemMessageRegex.test(message.text) &&
    message.text.indexOf(message.user) > -1;
};

export const isAdmin: (x: Message) => boolean = message =>
  // Any post that has the `user` field is from the backend
  typeof message.user !== 'undefined';

export const wasIMentioned: (x: Message, y?: string, z?: string) => boolean = (message, id, name) => {
  const myMessage = message.user === id || message.bot_id === id;
  return !myMessage && message.text.indexOf(`@${name || ''}`) > -1;
};

export const hasEmoji: (x: string) => boolean = (text) => {
  const chatHasEmoji = /(:[:a-zA-Z/_]*:)/;
  return chatHasEmoji.test(text);
};

export const hasAttachment: (x: string) => ?string[] = (text) => {
  // Get image url REGEX: uploaded a file:
  // <(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*))
  // 1st match will give us full match
  // 2nd match will give us complete attachment URL
  const systemAttachmentAttached = /uploaded a file: <(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))/;
  return text.match(systemAttachmentAttached);
};

export const decodeHtml: (x: string) => string = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};
