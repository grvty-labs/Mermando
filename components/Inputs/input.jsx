// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import moment from 'moment';
import Datetime from 'react-datetime';
import { WithContext as ReactTags } from 'react-tag-input';
import InputAtom from './input-atom';
import { inputTypes, messageTypes, keyCodes } from '../../js/inputs';

export type TagType = { id: number, text: string };

type Props = {
  id: string,
  label?: string,
  message?: string,
  messageType?: $Keys<typeof messageTypes>,
  forceMessageBeneath?: boolean,
  className?: string,
  +value?: string | number | Date | moment | Array<TagType>,

  leftIcon?: string,
  rightIcon?: string,

  type?: $Keys<typeof inputTypes>,
  pattern?: string,
  autoComplete?: boolean,
  autoCompleteOptions?: Array<string>,
  placeholder?: string,
  required?: boolean,
  forceInlineRequired?: boolean,
  editable?: boolean,
  disabled?: boolean,

  onChange?: Function,
  onFocus?: Function,
  onBlur?: Function,
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
  onChange: Function,
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

    autoComplete: false,
    required: false,
    forceInlineRequired: false,
    disabled: false,
    editable: true,
    type: 'text',
    onChange: () => {},
  };

  @autobind
  onHTMLInputChange(event: SyntheticInputEvent<*>) {
    const { type, onChange } = this.props;
    const { value } = event.target;
    let clean;

    if (!value) {
      onChange(value);
      return;
    }

    switch (type) {
      case 'number':
        clean = Number.parseInt(value, 10);
        if (!Number.isNaN(clean)) {
          onChange(clean);
        }
        break;

      case 'float':
        clean = Number.parseFloat(value);
        if (!Number.isNaN(clean)) {
          onChange(clean);
        }
        break;

      case 'email':
      case 'password':
      case 'tel':
      case 'text':
      case 'textarea':
      case 'url':
      default:
        clean = value;
        onChange(clean);
    }
  }

  @autobind
  onCustomInputChange(newValue: any, index?: number) {
    const { type, onChange, value } = this.props;
    let casted;

    switch (type) {
      case 'datetime':
      case 'date':
        onChange(newValue);
        break;

      case 'tags':
        casted = value && value.length > 0
          ? (value: Array<TagType>)
          : [];
        if (index === 0 || index) {
          onChange([
            ...casted.slice(0, index),
            ...casted.slice(index + 1),
          ]);
        } else {
          onChange([
            ...casted,
            { id: this.counter, text: newValue },
          ]);
          this.counter += 1;
        }
        break;

      default:
        break;
    }
  }

  counter: number = 0;
  inputElement: ?any;

  @autobind
  renderInput(otherProps: { [key: string]: string }) {
    const {
      id, type, className, value, required, disabled, editable,
      pattern, autoComplete, autoCompleteOptions, placeholder,
    } = this.props;

    let newClassName = className || '';
    newClassName = `${newClassName} ${!editable ? 'blocked' : ''}`;

    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...otherProps}
            ref={(input) => { this.inputElement = input; }}
            id={id}
            className={newClassName}
            value={value || ''}
            onChange={this.onHTMLInputChange}
            required={required}
            disabled={disabled || !editable}
            autoComplete={autoComplete}
          />
        );

      case 'datetime':
        return (
          <Datetime
            value={value}
            className='datetime-input'
            onChange={this.onCustomInputChange}
            dateFormat='DD-MMM-YYYY'
            timeFormat='hh:mm A'
            inputProps={{
              ...otherProps,
              id,
              ref: (input) => { this.inputElement = input; },
              className: newClassName,
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
            className='datetime-input'
            onChange={this.onCustomInputChange}
            dateFormat='DD-MMM-YYYY'
            timeFormat={false}
            inputProps={{
              ...otherProps,
              id,
              ref: (input) => { this.inputElement = input; },
              className: newClassName,
              required,
              disabled: disabled || !editable,
              readOnly: true,
            }}
          />
        );

      case 'tags':
        return (
          <ReactTags
            ref={(input) => { this.inputElement = input; }}
            id={id}
            readOnly={disabled || !editable}
            tags={value || []}
            suggestions={autoCompleteOptions}
            autofocus={false}
            delimiters={[
              keyCodes.PERIOD,
              keyCodes.COMMA,
              keyCodes.SEMI_COLON,
              keyCodes.COLON,
              keyCodes.SPACE,
              keyCodes.ENTER,
              keyCodes.TAB,
            ]}
            classNames={{
              tags: `tags ${editable && disabled ? 'disabled' : ''} ${newClassName}`,
              tagInput: 'inputLine',
              tagInputField: 'inputField',
              selected: 'inputEmul',
              tag: 'tag',
              remove: 'remove-btn',
              suggestions: 'suggestions',
              activeSuggestion: 'active',
            }}
            handleDelete={(index: number) => this.onCustomInputChange(null, index)}
            handleAddition={this.onCustomInputChange}
            placeholder={placeholder}
          />
        );

      case 'email':
      case 'float':
      case 'number':
      case 'password':
      case 'tel':
      case 'text':
      case 'url':
        return (
          <input
            {...otherProps}
            ref={(input) => { this.inputElement = input; }}
            type={
              type === 'float' ? 'number' : type
            } id={id}
            className={newClassName}
            value={value || ''}
            onChange={this.onHTMLInputChange}
            required={required}
            disabled={disabled || !editable}
            autoComplete={autoComplete}
            pattern={
              pattern ||
              type === 'number' ? '[-+]?[0-9]+' : '' ||
              type === 'float' ? '[-+]?[0-9]*[.,]?[0-9]+' : '' ||
              type === 'email' ? '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]$' : ''
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
      disabled, onChange, autoComplete,
      autoCompleteOptions, onFocus, onBlur,

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
        readOnly={!editable}
        disabled={disabled}
        empty={!value && value !== 0}
        invalid={messageType === 'error'}
        onClick={() => {
          if (this.inputElement) {
            this.inputElement.focus();
          }
        }}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {this.renderInput(otherProps)}
      </InputAtom>
    );
  }
}
