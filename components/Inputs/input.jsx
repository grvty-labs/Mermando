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
  value?: string | number,
  onChange: Function,

  leftIcon?: string,
  rightIcon?: string,

  type?: 'text' | 'number' | 'float' | 'password',
  pattern?: string,
  placeholder?: string,
  required?: boolean,
  forceRequiredIcon?: boolean,
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
  forceRequiredIcon: boolean,
  editable: boolean,
  disabled: boolean,
  type: 'text' | 'number' | 'float' | 'password',
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
    forceRequiredIcon: false,
    disabled: false,
    editable: true,
    type: 'text',
  };

  @autobind
  onValueChange(event: SyntheticEvent<*>) {
    const { type } = this.props;
    const { value } = event.target;
    let clean;

    if (!value) {
      this.props.onChange(value);
      return;
    }

    switch (type) {
      case 'number':
        clean = Number.parseInt(value, 10);
        if (!Number.isNaN(clean)) {
          this.props.onChange(clean);
        }
        break;

      case 'float':
        clean = Number.parseFloat(value);
        if (!Number.isNaN(clean)) {
          this.props.onChange(clean);
        }
        break;

      default:
        clean = value;
        this.props.onChange(clean);
    }
  }

  @autobind
  renderRightIcon() {
    const {
      forceRequiredIcon,
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
            : required && (!label || forceRequiredIcon)
              ? 'required'
              : rightIcon || 'none'
            }`
        }
        title={
          !label && message
            ? message
            : required && (!label || forceRequiredIcon)
              ? 'Required field'
              : null
        }
      />
    );
  }

  @autobind
  renderMessages() {
    const {
      forceRequiredIcon,
      label,
      required,
      message,
      messageType,
    } = this.props;

    if (label && (message || (required && !forceRequiredIcon))) {
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
      forceRequiredIcon,
      required,
      type,
      value,
      className,
      pattern,

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
              ((!label || forceRequiredIcon) && required) || rightIcon || (!label && message) ? 'r-icon' : ''
            } ${messageType === 'error' ? 'error' : ''}`
          }
        >
          <input
            {...otherProps}
            type={type} id={id}
            value={value || ''} onChange={this.onValueChange}
            required={required}
            disabled={disabled || !editable}
            pattern={
              pattern ||
              type === 'number' ? '[0-9]*' : '' ||
              type === 'float' ? '[.0-9]*' : ''
            }
          />
          <span className={`symbolicon ${leftIcon || 'none'}`} />
          {this.renderRightIcon()}
        </div>
        {this.renderMessages()}
      </div>
    );
  }
}
