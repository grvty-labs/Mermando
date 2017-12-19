// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Config from 'Config';
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
        className = `${Config.mermando.icons.classPrefix}${Config.mermando.icons.selectInput}`;
        break;
      default:
        className = rightIcon
          ? `${Config.mermando.icons.classPrefix}${rightIcon}`
          : message && !label && !forceMessageBeneath
            ? `${Config.mermando.icons.classPrefix}${messageType || ''}`
            : required && (!label || forceInlineRequired)
              ? `${Config.mermando.icons.classPrefix}${Config.mermando.icons.requiredInput}`
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

    const className = required && !forceInlineRequired
      ? 'info'
      : messageType !== 'text'
        ? messageType || ''
        : '';

    const iconClassName = required && !forceInlineRequired
      ? `${Config.mermando.icons.classPrefix}info`
      : messageType !== 'text'
        ? `${Config.mermando.icons.classPrefix}${messageType || ''}`
        : '';

    if (label && (message || (required && !forceInlineRequired))) {
      return (
        <small className={className}>
          <span className={iconClassName} />
          {message || 'Required field'}
        </small>
      );
    } else if (!label && message && forceMessageBeneath) {
      return (
        <small className={className}>
          <span className={iconClassName} />
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
          tabIndex={-1}
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
