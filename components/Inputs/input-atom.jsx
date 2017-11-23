// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Label from './label';
import { inputTypes, messageTypes } from '../../js/inputs';

type Props = {
  id: string,
  label?: string,
  message?: string,
  messageType?: $Keys<typeof messageTypes>,
  forceMessageBeneath?: boolean,
  className?: string,

  leftIcon?: string,
  rightIcon?: string,

  type?: $Keys<typeof inputTypes>,
  required?: boolean,
  forceInlineRequired?: boolean,

  children: React.Node | Array<React.Node>,
};

type Default = {
  label: string,
  className: string,

  message: string,
  messageType: $Keys<typeof messageTypes>,
  forceMessageBeneath: boolean,

  leftIcon: string,
  rightIcon: string,

  required: boolean,
  forceInlineRequired: boolean,
  type: $Keys<typeof inputTypes>,
};

export default class InputAtom extends React.PureComponent<Props, void> {
  static defaultProps: Default = {
    label: '',
    className: '',

    message: '',
    messageType: 'text',
    forceMessageBeneath: false,

    leftIcon: '',
    rightIcon: '',

    required: false,
    forceInlineRequired: false,
    type: 'text',
  };

  @autobind
  renderLeftIcon() {
    const {
      leftIcon,
      type,
    } = this.props;

    let className;
    switch (type) {
      case 'date':
        className = 'symbolicon calendar';
        break;

      case 'datetime':
        className = 'symbolicon calendar-check';
        break;

      default:
        break;
    }

    className = leftIcon
      ? `symbolicon ${leftIcon}`
      : className;

    return (
      <span className={`icon ${className || ''}`} />
    );
  }

  @autobind
  renderRightIcon() {
    const {
      forceInlineRequired,
      forceMessageBeneath,
      label,
      required,
      message,
      messageType,
      rightIcon,
    } = this.props;

    let className = required && (!label || forceInlineRequired)
      ? 'symbolicon required'
      : '';
    className = message && !label && !forceMessageBeneath
      ? `symbolicon ${messageType || ''}`
      : className;
    className = rightIcon
      ? `symbolicon ${rightIcon}`
      : className;

    const title = !label && message
      ? message
      : required && (!label || forceInlineRequired)
        ? 'Required field'
        : null;

    return (
      <span className={`icon ${className}`} title={title} />
    );
  }

  @autobind
  renderMessages() {
    const {
      forceMessageBeneath,
      forceInlineRequired,
      label,
      required,
      message,
      messageType,
    } = this.props;

    const className = messageType !== 'text' || (required && !forceInlineRequired)
      ? `symbolicon ${required ? 'info' : messageType || ''}`
      : '';

    if (label && (message || (required && !forceInlineRequired))) {
      return (
        <small className={className}>
          {message || 'Required field'}
        </small>
      );
    } else if (!label && message && forceMessageBeneath) {
      return (
        <small className={className}>
          {message}
        </small>
      );
    }
    return null;
  }

  render() {
    const {
      id, label, forceInlineRequired,
      required, type, className, message, messageType,
      leftIcon, rightIcon, children,
    } = this.props;


    return (
      <div className={`input-atom ${className || ''}`}>
        { label ? <Label htmlFor={id}>{label}</Label> : null}
        <div
          className={
            `input ${
              leftIcon || type === 'date' || type === 'datetime' ? 'prefix' : ''
            } ${
              ((!label || forceInlineRequired) && required) || rightIcon || (!label && message) ? 'suffix' : ''
            } ${messageType === 'error' ? 'error' : ''}`
          }
        >
          {children}
          {this.renderLeftIcon()}
          {this.renderRightIcon()}
        </div>
        {this.renderMessages()}
      </div>
    );
  }
}
