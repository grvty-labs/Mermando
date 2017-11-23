// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Datetime from 'react-datetime';
import InputAtom from './input-atom';
import { inputTypes, messageTypes } from '../../js/inputs';

type Props = {
  id: string,
  label?: string,
  message?: string,
  messageType?: $Keys<typeof messageTypes>,
  forceMessageBeneath?: boolean,
  className?: string,
  value?: string | number,

  leftIcon?: string,
  rightIcon?: string,

  type?: $Keys<typeof inputTypes>,
  pattern?: string,
  placeholder?: string,
  required?: boolean,
  forceInlineRequired?: boolean,
  editable?: boolean,
  disabled?: boolean,

  onChange: Function,
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
  editable: boolean,
  disabled: boolean,
  type: $Keys<typeof inputTypes>,
};

export default class Input extends React.PureComponent<Props, void> {
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

      case 'password':
      case 'text':
      case 'textarea':
      default:
        clean = value;
        this.props.onChange(clean);
    }
  }

  @autobind
  renderInput(otherProps: { [key: string]: string }) {
    const {
      id, type, value, required, disabled, editable,
      pattern, onChange,
    } = this.props;

    let className = otherProps.className || '';
    className = `${className} ${!editable ? 'blocked' : ''}`;

    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...otherProps}
            id={id}
            className={className}
            value={value || ''} onChange={this.onValueChange}
            required={required}
            disabled={disabled || !editable}
          />
        );

      case 'datetime':
        return (
          <Datetime
            value={value}
            className='datetime'
            onChange={onChange}
            dateFormat='DD-MMM-YYYY'
            timeFormat='hh:mm A'
            inputProps={{
              ...otherProps,
              id,
              className,
              required,
              disabled: disabled || !editable,
              readOnly: true,
            }}
          />
        );

      case 'date':
        return (
          <Datetime
            value={value}
            className='datetime'
            onChange={onChange}
            dateFormat='DD-MMM-YYYY'
            timeFormat={false}
            inputProps={{
              ...otherProps,
              id,
              className,
              required,
              disabled: disabled || !editable,
              readOnly: true,
            }}
          />
        );

      case 'text':
      case 'number':
      case 'float':
      case 'password':
        return (
          <input
            {...otherProps}
            type={type} id={id}
            className={className}
            value={value || ''} onChange={this.onValueChange}
            required={required}
            disabled={disabled || !editable}
            pattern={
              pattern ||
              type === 'number' ? '[0-9]*' : '' ||
              type === 'float' ? '[.0-9]*' : ''
            }
          />
        );

      default:
        return (null);
    }
  }

  render() {
    const {
      id, label, forceInlineRequired,
      required, type, value,
      className, pattern,

      forceMessageBeneath, message, messageType,

      leftIcon, rightIcon, editable,
      disabled, onChange,

      ...otherProps
    } = this.props;


    return (
      <InputAtom
        id={id} label={label}
        message={message}
        messageType={messageType}
        forceInlineRequired={forceInlineRequired}
        forceMessageBeneath={forceMessageBeneath}
        className={className}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        required={required}
        type={type}
      >
        {this.renderInput(otherProps)}
      </InputAtom>
    );
  }
}
