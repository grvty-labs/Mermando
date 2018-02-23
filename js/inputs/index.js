// @flow

export const inputTypes = {
  avatar: 'avatar',
  color: 'color',
  date: 'date',
  datetime: 'datetime',
  email: 'email',
  file: 'file',
  float: 'float',
  number: 'number',
  password: 'password',
  select: 'select',
  tags: 'tags',
  tel: 'tel',
  text: 'text',
  textarea: 'textarea',
  time: 'time',
  url: 'url',
};

export const simpleInputTypes = {
  color: 'color',
  date: 'date',
  datetime: 'datetime',
  email: 'email',
  float: 'float',
  number: 'number',
  password: 'password',
  tags: 'tags',
  tel: 'tel',
  text: 'text',
  textarea: 'textarea',
  time: 'time',
  url: 'url',
};

export const messageTypes = {
  text: 'text',
  info: 'info',
  subtle: 'subtle',
  success: 'success',
  error: 'error',
};

export const keyCodes: { [key: string ]: number } = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  ESCAPE: 27,
  SPACE: 32,
  UP_ARROW: 38,
  DOWN_ARROW: 40,
  SEMI_COLON: 185,
  COLON: 185,
  COMMA: 188,
  PERIOD: 190,
};

export default inputTypes;
