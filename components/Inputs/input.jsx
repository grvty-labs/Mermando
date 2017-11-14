// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Label from './label';

type Props = {
  id: string,
  label?: string,
  message?: string,
  messageType?: 'info' | 'subtle' | 'success' | 'error',
  className?: string,
  value: string | number,
  onChange: Function,

  leftIcon?: string,
  rightIcon?: string,

  type?: 'text' | 'number' | 'password',
  required?: boolean,
  editable?: boolean,
  disabled?: boolean,
};

type Default = {
  label: string,
  className: string,

  message: string,
  messageType: 'info' | 'subtle' | 'success' | 'error',

  leftIcon: string,
  rightIcon: string,

  required: boolean,
  editable: boolean,
  disabled: boolean,
  type: 'text' | 'number' | 'password',
}

export default class Input extends React.PureComponent<Props, void> {
  static defaultProps: Default = {
    label: '',
    className: '',

    message: '',
    messageType: 'info',

    leftIcon: '',
    rightIcon: '',

    required: false,
    disabled: false,
    editable: true,
    type: 'text',
  };

  @autobind
  onValueChange(event: SyntheticEvent<*>) {
    this.props.onChange(event.target.value);
  }

  @autobind
  renderRightIcon() {
    const {
      label,
      required,
      message,
      messageType,
      rightIcon,
    } = this.props;

    return (
      <span
        className={
          `symbolicon ${
            !label && message
            ? messageType || ''
            : required && !label
              ? 'required'
              : rightIcon || 'none'
            }`
        }
        title={
          !label && message
            ? message
            : required && !label
              ? 'Required field'
              : null
        }
      />
    );
  }

  @autobind
  renderMessages() {
    const {
      label,
      required,
      message,
      messageType,
    } = this.props;
    if (label && (message || required)) {
      return (
        <small className={`symbolicon ${messageType || 'required'}`}>
          {message || 'Required field'}
        </small>
      );
    }
    return null;
  }

  render() {
    const {
      id,
      label,
      required,
      type,
      value,
      className,

      message,
      messageType,

      leftIcon,
      rightIcon,
      editable,
      disabled,

      ...otherProps
    } = this.props;


    return (
      <div className={`input-atom ${!editable ? 'blocked' : ''} ${className || ''}`}>
        { label ? <Label htmlFor={id}>{label}</Label> : null}
        <div
          className={
            `input-group ${leftIcon ? 'l-icon' : ''} ${
              required || rightIcon || (!label && message) ? 'r-icon' : ''
            } ${messageType === 'error' ? 'error' : ''}`
          }
        >
          <input
            {...otherProps}
            type={type} id={id}
            value={value} onChange={this.onValueChange}
            required={required}
            disabled={disabled || !editable}
          />
          <span className={`symbolicon ${leftIcon || 'none'}`} />
          {this.renderRightIcon()}
        </div>
        {this.renderMessages()}
      </div>
    );
  }
}
