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
  +defaultValue?: Value,
  maxTags?: number,
  maxLength?: number,
  validationErrorReport?: 'none' | 'onChange' | 'onBlur',

  dateFormat?: string,
  closeOnSelect?: boolean,

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

  validationErrorReport: 'none',

  messagesArray: Message[],
  message: string,
  messageType: $Keys<typeof messageTypes>,
  forceMessageBeneath: boolean,

  viewDate: moment | string,

  maxLength: number,

  dateFormat: string,
  closeOnSelect: boolean,

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

    validationErrorReport: 'none',

    messagesArray: [],
    message: '',
    messageType: 'text',
    forceMessageBeneath: false,

    viewDate: moment(),

    maxLength: 255,

    dateFormat: 'DD-MMM-YYYY',
    closeOnSelect: false,

    leftIcon: '',
    rightIcon: '',

    autoComplete: false,
    required: false,
    forceInlineRequired: false,
    disabled: false,
    editable: true,
    type: 'text',
  };

  componentDidMount() {
    const { value, inputElement, type } = this.props;
    if (value) {
      switch (type) {
        case 'email':
          this.runValidationTest(value, this.EMAIL_PATTERN);
          break;
        case 'color':
          this.runValidationTest(value, this.COLOR_PATTERN);
          break;
        default:
          break;
      }
      if (inputElement) {
        this.onResizeValue();
      }
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.value !== this.props.value) {
      this.onResizeValue();
    }
  }

  @autobind
  onResizeValue() {
    if (this.props.type === 'textarea') {
      setTimeout(() => {
        if (this.inputElement) {
          this.inputElement.style.cssText = 'height:auto; padding: 0';
          this.inputElement.style.cssText = `height: ${this.inputElement.scrollHeight}px`;
        }
      }, 0);
    }
  }

  @autobind
  onHTMLInputChange(event: SyntheticInputEvent<*>) {
    const {
      type, onChange, maxLength, validationErrorReport,
    } = this.props;
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

          case 'email':
            if (validationErrorReport === 'onChange') {
              this.runValidationTest(value, this.EMAIL_PATTERN);
            }
            clean = value;
            onChange(clean, this.validInput);
            break;

          case 'color':
            if (validationErrorReport === 'onChange') {
              this.runValidationTest(value, this.COLOR_PATTERN);
            }
            clean = value;
            onChange(clean, this.validInput);
            break;

          case 'textarea':
          case 'password':
          case 'tel':
          case 'text':
          case 'url':
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
            if (casted.length > 1) {
              const [max] = casted.sort((a, b) => (a.id < b.id ? 1 : -1));
              this.counter = max.id + 1;
            } else {
              this.counter += 1;
            }
            onChange([
              ...casted,
              { id: this.counter, text: newValue },
            ]);
          }
          break;

        default:
          break;
      }
    }
  }

  @autobind
  onHTMLInputBlur(event: SyntheticInputEvent<*>) {
    const {
      type, onBlur, maxLength, validationErrorReport,
    } = this.props;
    const { value } = event.target;
    let clean;

    if (!maxLength || value.length <= maxLength) {
      if (onBlur) {
        if (!value) {
          onBlur(value);
          return;
        }

        switch (type) {
          case 'number':
            clean = Number.parseInt(value, 10);
            if (!Number.isNaN(clean)) onBlur(clean);
            break;

          case 'float':
            clean = Number.parseFloat(value);
            if (!Number.isNaN(clean)) onBlur(clean);
            break;

          case 'email':
            if (validationErrorReport === 'onBlur') {
              this.runValidationTest(value, this.EMAIL_PATTERN);
            }
            clean = value;
            onBlur(clean, this.validInput);
            break;

          case 'color':
            if (validationErrorReport === 'onBlur') {
              this.runValidationTest(value, this.COLOR_PATTERN);
            }
            clean = value;
            onBlur(clean, this.validInput);
            break;

          case 'textarea':
          case 'password':
          case 'tel':
          case 'text':
          case 'url':
          default:
            clean = value;
            onBlur(clean);
            break;
        }
      }
    }
  }

  @autobind
  runValidationTest(value, regExpPattern) {
    const { type } = this.props;

    const rex = new RegExp(regExpPattern);
    if (rex.test(value) === false) {
      this.messageOverrideType = 'error';
      this.validInput = false;

      switch (type) {
        case 'email':
          this.messageOverride = 'Please use an appropriate format for email';
          break;
        default:
          break;
      }
    } else {
      this.messageOverrideType = undefined;
      this.messageOverride = undefined;
      this.validInput = true;
    }
  }

  counter: number = 0;
  inputElement: ?any;
  validInput: boolean;
  messageOverride: ?string;
  messageOverrideType: ?string;
  COLOR_PATTERN: string = '[0-9A-Fa-f]{6}';
  NUMBER_PATTERN: string = '^[-+]?[0-9]+$';
  FLOAT_PATTERN: string = '[-+]?[0-9]*[.,]?[0-9]+';
  EMAIL_PATTERN: string = '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,10}$';

  @autobind
  generatePattern() {
    const { pattern, type } = this.props;
    let newPattern = pattern;
    if (!newPattern) {
      switch (type) {
        case 'color':
          newPattern = this.COLOR_PATTERN;
          break;
        case 'number':
          newPattern = this.NUMBER_PATTERN;
          break;
        case 'float':
          newPattern = this.FLOAT_PATTERN;
          break;
        // case 'tel':
        //   newPattern = '[\\+]\\d{2}[\\(]\\d{2}[\\)]\\d{4}[\\-]\\d{4}';
        //   break;
        case 'email':
          newPattern = this.EMAIL_PATTERN;
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
      dateFormat, closeOnSelect, defaultValue,
    } = this.props;

    let newClassName = className || '';
    newClassName = `${newClassName} ${!editable ? 'blocked' : ''}`;

    const moreProps = (value !== undefined) ? { value: value || '' } : {};
    const moreDefaultValue = (defaultValue !== undefined) ? { defaultValue: defaultValue || '' } : {};

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
            dateFormat={dateFormat}
            timeFormat='hh:mm A'
            isValidDate={isValidDate}
            closeOnSelect={closeOnSelect}
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
            closeOnSelect={closeOnSelect}
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
            dateFormat={dateFormat}
            viewDate={viewDate}
            timeFormat={false}
            isValidDate={isValidDate}
            closeOnSelect={closeOnSelect}
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
            {...moreDefaultValue}
            {...moreProps}
            onChange={this.onHTMLInputChange}
            onBlur={this.onHTMLInputBlur}
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
      dateFormat, closeOnSelect, validationErrorReport,

      ...otherProps
    } = this.props;

    const messageString = this.messageOverride && this.messageOverride.length
      ? this.messageOverride
      : message;
    const messageTypeString = this.messageOverrideType && this.messageOverrideType.length
      ? this.messageOverrideType
      : messageType;

    return (
      <InputAtom
        id={id} label={label}
        messagesArray={messagesArray}
        message={messageString}
        messageType={messageTypeString}
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
      >
        {this.renderInput(otherProps)}
      </InputAtom>
    );
  }
}
