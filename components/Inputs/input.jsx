// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import moment from 'moment';
import Datetime from 'react-datetime';
import { WithContext as ReactTags } from 'react-tag-input';
import InputAtom from './input-atom';
import { simpleInputTypes as inputTypes, messageTypes, keyCodes } from '../../js/inputs';

import type { Message } from './input-atom';

export type TagType = { id: number, text: string };
export type Value = string | number | moment | TagType[];

export type Props = {
  id: string | number,
  label?: string,
  messagesArray?: Message[],
  message?: string,
  messageType?: $Keys<typeof messageTypes>,
  forceMessageBeneath?: boolean,
  className?: string,
  +value?: Value,
  maxTags?: number,
  maxLength?: number,

  leftIcon?: string,
  rightIcon?: string,

  type?: $Keys<typeof inputTypes>,
  pattern?: string,
  autoComplete?: boolean,
  autoCompleteOptions?: string[],
  placeholder?: string,
  viewDate?: moment | string,
  required?: boolean,
  forceInlineRequired?: boolean,
  editable?: boolean,
  disabled?: boolean,

  onChange?: Function,
  onFocus?: Function,
  onBlur?: Function,
  isValidDate?: Function,
};

type Default = {
  label: string,
  className: string,

  messagesArray: Message[],
  message: string,
  messageType: $Keys<typeof messageTypes>,
  forceMessageBeneath: boolean,

  viewDate: moment | string,

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

    messagesArray: [],
    message: '',
    messageType: 'text',
    forceMessageBeneath: false,

    viewDate: moment(),

    leftIcon: '',
    rightIcon: '',

    autoComplete: false,
    required: false,
    forceInlineRequired: false,
    disabled: false,
    editable: true,
    type: 'text',
  };

  @autobind
  onHTMLInputChange(event: SyntheticInputEvent<*>) {
    const { type, onChange, maxLength } = this.props;
    const { value } = event.target;
    let clean;

    if (!maxLength || value.length <= maxLength) {
      if (onChange) {
        if (!value) {
          onChange(value);
          return;
        }

        // const pattern = this.generatePattern();
        // console.log(!new RegExp(pattern).test(value));
        // if (pattern && !new RegExp(pattern).test(value)) {
        //   onChange(this.props.value);
        //   return
        // }

        switch (type) {
          case 'number':
            clean = Number.parseInt(value, 10);
            if (!Number.isNaN(clean)) onChange(clean);
            break;

          case 'float':
            clean = Number.parseFloat(value);
            if (!Number.isNaN(clean)) onChange(clean);
            break;

          case 'textarea':
            clean = value;
            onChange(clean);
            setTimeout(() => {
              if (this.inputElement) {
                this.inputElement.style.cssText = 'height:auto; padding: 0';
                this.inputElement.style.cssText = `height: ${this.inputElement.scrollHeight}px`;
              }
            }, 0);
            break;

          case 'email':
          case 'password':
          case 'tel':
          case 'text':
          case 'url':
          case 'color':
          default:
            clean = value;
            onChange(clean);
            break;
        }
      }
    }
  }

  @autobind
  onCustomInputChange(newValue: ?Value, index?: number) {
    const {
      type, onChange, value, maxTags,
    } = this.props;
    let casted;

    if (onChange) {
      switch (type) {
        case 'datetime':
        case 'date':
        case 'time':
          onChange(newValue);
          break;

        case 'tags':
          if (maxTags && value && value.length >= maxTags) {
            break;
          }
          casted = value && value.length > 0
            ? (value: TagType[])
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
  }

  counter: number = 0;
  inputElement: ?any;

  @autobind
  generatePattern() {
    const { pattern, type } = this.props;
    let newPattern = pattern;
    if (!newPattern) {
      switch (type) {
        case 'color':
          newPattern = '[0-9A-Fa-f]{6}';
          break;
        case 'number':
          newPattern = '[-+]?[0-9]+';
          break;
        case 'float':
          newPattern = '[-+]?[0-9]*[.,]?[0-9]+';
          break;
        // case 'tel':
        //   newPattern = '[\\+]\\d{2}[\\(]\\d{2}[\\)]\\d{4}[\\-]\\d{4}';
        //   break;
        case 'email':
          newPattern = '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]+$';
          break;
        default:
          break;
      }
    }
    return newPattern;
  }

  @autobind
  renderInput(otherProps: { [key: string]: string }) {
    const {
      id, type, className, value, required, disabled, editable,
      autoComplete, autoCompleteOptions, placeholder, viewDate, isValidDate,
    } = this.props;

    let newClassName = className || '';
    newClassName = `${newClassName} ${!editable ? 'blocked' : ''}`;

    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...otherProps}
            ref={(input) => { this.inputElement = input; }}
            id={`${id}`}
            className={newClassName}
            value={value || ''}
            onChange={this.onHTMLInputChange}
            required={required}
            disabled={disabled || !editable}
            // autoComplete={autoComplete}
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
            isValidDate={isValidDate}
            inputProps={{
              ...otherProps,
              id: `${id}`,
              ref: (input) => { this.inputElement = input; },
              className: newClassName,
              required,
              disabled: disabled || !editable,
              readOnly: true,
            }}
          />
        );

      case 'time':
        return (
          <Datetime
            value={value}
            className='datetime-input'
            onChange={this.onCustomInputChange}
            dateFormat={false}
            timeFormat='hh:mm A'
            isValidDate={isValidDate}
            inputProps={{
              ...otherProps,
              id: `${id}`,
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
            viewDate={viewDate}
            timeFormat={false}
            isValidDate={isValidDate}
            inputProps={{
              ...otherProps,
              id: `${id}`,
              ref: (input) => { this.inputElement = input; },
              className: newClassName,
              required,
              disabled: disabled || !editable,
              readOnly: true,
            }}
          />
        );

      case 'color':
        return (
          /* TODO Fix color picker */
          <div className='color-container'>
            <input
              {...otherProps}
              ref={(input) => { this.inputElement = input; }}
              id={`${id}`}
              type='text'
              className={newClassName}
              value={value || ''}
              onChange={this.onHTMLInputChange}
              required={required}
              disabled={disabled || !editable}
              pattern={this.generatePattern()}
            />
            <div className='color' style={{ backgroundColor: `#${value}` }} />
          </div>
        );

      case 'tags':
        return (
          <ReactTags
            // ref={(input) => { this.inputElement = input; }}
            id={`${id}`}
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
            } id={`${id}`}
            className={newClassName}
            value={value || ''}
            onChange={this.onHTMLInputChange}
            required={required}
            disabled={disabled || !editable}
            // autoComplete={autoComplete}
            pattern={this.generatePattern()}
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

      forceMessageBeneath, message, messageType, messagesArray,

      leftIcon, rightIcon, editable,
      disabled, onChange, autoComplete,
      autoCompleteOptions, onFocus, onBlur, isValidDate, viewDate,

      ...otherProps
    } = this.props;

    return (
      <InputAtom
        id={id} label={label}
        messagesArray={messagesArray}
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
        onClick={() => { if (this.inputElement) this.inputElement.focus(); }}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {this.renderInput(otherProps)}
      </InputAtom>
    );
  }
}
