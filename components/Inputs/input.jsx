// @flow
import * as React from 'react';
import Label from './label';

type Props = {
  id: string,
  label?: string,
  error?: boolean,
  message?: string,
  messageType?: 'info' | 'subtle' | 'success' | 'error',
  className?: string,
  value: string | number,
  onChange: Function,

  leftIcon?: string,
  rightIcon?: string,

  type?: 'text' | 'number',
  required?: boolean,
};

type Default = {
  label: string,
  error: boolean,
  className: string,

  message: string,
  messageType: 'info' | 'subtle' | 'success' | 'error',

  leftIcon: string,
  rightIcon: string,

  required: boolean,
  type: 'text' | 'number',
}

export default class Checkbox extends React.Component<Props, void> {
  static defaultProps: Default = {
    label: '',
    error: false,
    className: '',

    message: '',
    messageType: 'info',

    leftIcon: '',
    rightIcon: '',

    required: false,
    type: 'text',
  };

  constructor(props: Props) {
    super(props);
    (this: any).onValueChange = this.onValueChange.bind(this);
  }

  onValueChange(event: SyntheticEvent<*>) {
    this.props.onChange(event.target.value);
  }

  render() {
    const {
      id,
      label,
      required,
      type,
      value,
      className,
      error,

      message,
      messageType,

      leftIcon,
      rightIcon,

      ...otherProps
    } = this.props;

    return (
      <div className={`input-atom ${className || ''}`}>
        { label ? <Label htmlFor={id}>{label}</Label> : null}
        <div
          className={
            `input-group ${leftIcon ? 'l-icon' : ''} ${required || rightIcon ? 'r-icon' : ''} ${error ? 'error' : ''}`
          }
        >
          <input
            {...otherProps}
            type={type} id={id}
            value={value} onChange={this.onValueChange}
            required={required}
          />
          <span className={`symbolicon ${leftIcon || 'none'}`} />
          <span className={`symbolicon ${required && !label ? 'required' : rightIcon || 'none'}`} />
        </div>
        { label && required ? <small className='symbolicon required'>Required field</small> : null}
        { message ? <small className={messageType}>{message}</small> : null}
      </div>
    );
  }
}
