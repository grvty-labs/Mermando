// @flow
import { chat } from 'slack';

type PostMsg = {
  user?: string | number,
  username?: string,
  text: string,
  lastThreadTs?: string,
  token: string,
  channel: string | number,
  as_user?: boolean,
};

export const arraysIdentical = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export const decodeHtml: (x: string) => string = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

export function filterNewMessages<T>(oldMessages: T[], newMessages: T[]): T[] {
  const oldMessagesText = JSON.stringify(oldMessages);
  // Message Order has to be consistent
  const differenceInMessages = newMessages.filter((i) => {
    if (oldMessagesText.indexOf(JSON.stringify(i)) === -1) {
      return i;
    }
    return false;
  });
  return differenceInMessages;
}

export const hasEmoji: (x: string) => boolean = (text) => {
  const chatHasEmoji = /(:[:a-zA-Z/_]*:)/;
  return chatHasEmoji.test(text);
};

export function postMessage(msg: PostMsg): Promise<*> {
  return new Promise((accept: Function, reject: Function) => {
    const {
      text, lastThreadTs, token, channel, username, as_user,
    } = msg;
    if (text) {
      const newMSG = {
        token,
        channel,
        text,
        as_user,
      };
      console.log(lastThreadTs);
      if (lastThreadTs) newMSG.thread_ts = lastThreadTs;
      if (username) newMSG.username = username;
      return chat.postMessage(newMSG, (err, data) => (err ? reject(err) : accept(data)));
    }
    return reject();
  });
}
