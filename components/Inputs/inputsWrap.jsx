// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Config from 'Config';
import { messageTypes } from '../../js/inputs';

import type { Message } from './input-atom';

type Props = {
  className?: string,
  label?: string,
  children: React.Node,
  type?: 'column' | 'inline' | 'grid-row' | 'grid-col',
  rowsNumber?: number,

  message?: string,
  messagesArray?: Message[],
  messageType?: $Keys<typeof messageTypes>,
};
type State = {};
type Default = {
  type: 'column' | 'inline' | 'grid-row' | 'grid-col',
  rowsNumber: number,
};

export default class InputsWrap extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    type: 'column',
    rowsNumber: 3,
  };

  @autobind
  messageTypeIcon(type?: $Keys<typeof messageTypes>): string {
    const { icons } = Config.mermando;
    switch (type) {
      case 'info':
        return `${icons.classPrefix}${icons.msgInfo}`;
      case 'subtle':
        return `${icons.classPrefix}${icons.msgSubtle}`;
      case 'success':
        return `${icons.classPrefix}${icons.msgSuccess}`;
      case 'error':
        return `${icons.classPrefix}${icons.msgError}`;
      case 'text':
      default:
        return '';
    }
  }

  @autobind
  renderMainMessages() {
    const {
      message,
      messageType,
    } = this.props;

    const className = messageType !== 'text'
      ? messageType || ''
      : '';

    const iconClassName = messageType !== 'text'
      ? this.messageTypeIcon(messageType)
      : '';

    return (
      <small className={className} key={1}>
        <span className={iconClassName} />{message}
      </small>
    );
  }

  @autobind
  renderMultipleMessages() {
    const { messagesArray } = this.props;
    if (messagesArray) {
      const msgRender = messagesArray.map((msg, index) => (
        <small key={index + 1} className={msg.type !== 'text' ? msg.type || '' : ''}>
          <span className={msg.type !== 'text' ? this.messageTypeIcon(msg.type) : ''} />
          {msg.text}
        </small>));
      msgRender.unshift(this.renderMainMessages());
      return msgRender;
    }
    return this.renderMainMessages();
  }

  render() {
    const {
      className, label, children, rowsNumber, type,
    } = this.props;
    const style = type === 'grid-row'
      ? { gridTemplateRows: `repeat(${rowsNumber || 3}, min-content)` }
      : type === 'grid-col'
        ? { gridTemplateColumns: `repeat(${rowsNumber || 3}, minmax(70px, min-content))` }
        : {};

    return (
      <div className={`inputs-wrap ${className || ''}`}>
        <span className='legend'>{label}</span>
        <div className={type || ''} style={style}>
          {children}
        </div>
        <div className='msgs'>{this.renderMultipleMessages()}</div>
      </div>
    );
  }
}
