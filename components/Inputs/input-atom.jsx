// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import classnames from 'classnames';
import Config from 'Config';
import Label from './label';
import { inputTypes, messageTypes } from '../../js/inputs';

export type Message = {
  text: string,
  type: $Keys<typeof messageTypes>,
};

type Props = {
  id: string | number,
  label?: string,

  messagesArray?: Array<Message>,
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

  messagesArray: Array<Message>,
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

    messagesArray: [],
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
  renderLeftIcon(): React.Node {
    const {
      leftIcon,
      type,
    } = this.props;

    let className;
    switch (type) {
      case 'color':
        className = `${Config.mermando.icons.classPrefix}${Config.mermando.icons.colorInput}`;
        break;

      case 'date':
        className = `${Config.mermando.icons.classPrefix}${Config.mermando.icons.dateInput}`;
        break;

      case 'datetime':
        className = `${Config.mermando.icons.classPrefix}${Config.mermando.icons.datetimeInput}`;
        break;

      case 'file':
        className = `${Config.mermando.icons.classPrefix}${Config.mermando.icons.fileInput}`;
        break;

      default:
        break;
    }

    className = leftIcon
      ? `${Config.mermando.icons.classPrefix}${leftIcon}`
      : className;

    return (
      <span className={`icon ${className || ''}`} />
    );
  }

  @autobind
  renderRightIcon(): React.Node {
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
    const { icons } = Config.mermando;

    const title = !label && message
      ? message
      : required && (!label || forceInlineRequired)
        ? 'Required field'
        : null;

    return (
      <span
        className={classnames('icon', {
          [`${icons.classPrefix}`]: rightIcon || type === 'select' || (required && (!label || forceInlineRequired)),
          [`${icons.requiredInput}`]: required && (!label || forceInlineRequired),
          [`${this.messageTypeIcon(messageType)}`]: message && !label && !forceMessageBeneath,
          [`${icons.selectInput}`]: type === 'select',
          [`${rightIcon || ''}`]: rightIcon,
        })}
        title={title}
      />
    );
  }

  @autobind
  renderMainMessage() {
    const {
      forceMessageBeneath,
      forceInlineRequired,
      label,
      required,
      message,
      messageType,
    } = this.props;

    const className = required && !forceInlineRequired
      ? 'info'
      : messageType !== 'text'
        ? messageType || ''
        : '';

    const iconClassName = required && !forceInlineRequired
      ? this.messageTypeIcon('info')
      : messageType !== 'text'
        ? this.messageTypeIcon(messageType)
        : '';

    if (label && (message || (required && !forceInlineRequired))) {
      return (
        <small className={className} key={1}>
          <span className={iconClassName} />
          {message || 'Required field'}
        </small>
      );
    } else if (!label && message && forceMessageBeneath) {
      return (
        <small className={className} key={1}>
          <span className={iconClassName} />
          {message}
        </small>
      );
    }
    return null;
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
      msgRender.unshift(this.renderMainMessage());
      return msgRender;
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
          if (onBlur) { onBlur(); }
          this.setState({ focused: false });
        }}
        onFocus={() => {
          if (onFocus) { onFocus(); }
          this.setState({ focused: true });
        }}
      >
        { label ? <Label htmlFor={id}>{label}</Label> : null}
        <div
          className={`input-sham ${type || ''}-sham`}
          onClick={onClick}
          onKeyPress={onClick}
          role='textbox'
          tabIndex={-1}
        >
          {this.renderLeftIcon()}
          {children}
          {this.renderRightIcon()}
        </div>
        <div className='msgs'>{this.renderMultipleMessages()}</div>
        <div className='footer'>{footer}</div>
      </div>
    );
  }
}
