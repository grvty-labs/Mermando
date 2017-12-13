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
  footer?: React.Node | Array<React.Node>,

  readOnly?: boolean,
  disabled?: boolean,
  empty?: boolean,
  invalid?: boolean,
  onClick?: Function,
  onFocus?: Function,
  onBlur?: Function,
};

type State = {
  focused: boolean,
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

  readOnly: boolean,
  disabled: boolean,
  empty: boolean,
  invalid: boolean,
};

export default class InputAtom extends React.PureComponent<Props, State> {
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

    readOnly: false,
    disabled: false,
    empty: false,
    invalid: false,
  };

  state: State = {
    focused: false,
  }

  @autobind
  renderLeftIcon() {
    const {
      leftIcon,
      type,
    } = this.props;

    let className;
    switch (type) {
      case 'color':
        className = 'symbolicon hashtag';
        break;

      case 'date':
        className = 'symbolicon calendar';
        break;

      case 'datetime':
        className = 'symbolicon calendar-check';
        break;

      case 'file':
        className = 'symbolicon cloud-upload';
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
      type,
    } = this.props;

    let className = '';
    switch (type) {
      case 'select':
        className = 'symbolicon angle';
        break;
      default:
        className = rightIcon
          ? `symbolicon ${rightIcon}`
          : message && !label && !forceMessageBeneath
            ? `symbolicon ${messageType || ''}`
            : required && (!label || forceInlineRequired)
              ? 'symbolicon required'
              : '';
    }

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
      id, label, required, className, children, footer,
      readOnly, disabled, empty, invalid, type, onClick,
      onFocus, onBlur,
    } = this.props;
    const { focused } = this.state;

    const newClassName = `input-atom ${className || ''} ${empty ? 'empty ' : ''}${disabled ? 'disabled ' : ''}
      ${readOnly ? 'readOnly ' : ''}${required ? 'required ' : ''}${invalid ? 'invalid ' : ''}${focused ? 'focused ' : ''}`;

    return (
      <div
        className={newClassName}
        onBlur={() => {
          if (onBlur) {
            onBlur();
          }
          this.setState({ focused: false });
        }}
        onFocus={() => {
          if (onFocus) {
            onFocus();
          }
          this.setState({ focused: true });
        }}
      >
        { label ? <Label htmlFor={id}>{label}</Label> : null}
        <div
          className={`input-sham ${type || ''}-sham`}
          onClick={onClick}
          onKeyPress={onClick}
          role='textbox'
          tabIndex={0}
        >
          {this.renderLeftIcon()}
          {children}
          {this.renderRightIcon()}
        </div>
        <div className='msgs'>{this.renderMessages()}</div>
        <div className='footer'>{footer}</div>
      </div>
    );
  }
}
