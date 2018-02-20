// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import { simpleInputTypes as inputTypes, messageTypes } from '../../js/inputs';
import InputAtom from './input-atom';
import type { Message } from './input-atom';

export type Value = string | number | Array<string | number>;

export type Option = {
  display: string | number,
  value: string | number,
  options?: Array<Option>,
  [key: string]: any,
};

export type Props = {
  id: string,
  label?: string,
  messagesArray?: Array<Message>,
  message?: string,
  messageType?: $Keys<typeof messageTypes>,
  className?: string,
  value?: Value,

  forceMessageBeneath?: boolean,
  forceInlineRequired?: boolean,

  leftIcon?: string,
  rightIcon?: string,

  type?: $Keys<typeof inputTypes>,
  options: Array<Option>,
  placeholder?: string,
  required?: boolean,
  editable?: boolean,
  disabled?: boolean,

  onChange?: Function,
  onFocus?: Function,
  onBlur?: Function,
  onSelect?: Function,
};

type Default = {
  label: string,
  className: string,

  messagesArray: Array<Message>,
  message: string,
  messageType: $Keys<typeof messageTypes>,

  forceMessageBeneath: boolean,
  forceInlineRequired: boolean,

  leftIcon: string,
  rightIcon: string,

  required: boolean,
  editable: boolean,
  disabled: boolean,
  type: $Keys<typeof inputTypes>,
}

type State = {
  showOptionsLevel: number
};

export default class DataListInput extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    label: '',
    className: '',

    messagesArray: [],
    message: '',
    messageType: 'text',

    leftIcon: '',
    rightIcon: '',

    forceMessageBeneath: false,
    forceInlineRequired: false,


    required: false,
    disabled: false,
    editable: true,
    type: 'text',
  };

  state: State = {
    showOptionsLevel: 0,
  }

  componentDidMount() {
    const { options, required, value } = this.props;
    if (required && !value) {
      this.onSelectValue([options].value);
    }
  }

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
            this.handleClick();
            clean = value;
            onChange(clean);
            break;
        }
      }
    }
  }

  @autobind
  onSelectValue(newValue: string | number) {
    const {
      onSelect,
    } = this.props;
    if (onSelect) {
      this.setState({ showOptionsLevel: 0 }, () => {
        onSelect(newValue);
        document.removeEventListener('click', this.handleOutsideClick);
      });
    }
  }

  node: ?HTMLDivElement;

  @autobind
  handleClick() {
    const { editable, disabled } = this.props;
    if (!editable || disabled) {
      return;
    }
    if (this.state.showOptionsLevel === 0) {
      document.addEventListener('click', this.handleOutsideClick);
      this.setState({ showOptionsLevel: 1 });
    }
  }

  @autobind
  handleOutsideClick(e: Event) {
    // ignore clicks on the component itself
    if (this.node && this.node.contains(e.target)) {
      return;
    }

    this.setState({ showOptionsLevel: 0 });
    document.removeEventListener('click', this.handleOutsideClick);
  }

  @autobind
  renderOptions() {
    const { options } = this.props;
    const { showOptionsLevel } = this.state;
    return (
      <div
        className={`options ${showOptionsLevel > 0 ? 'open' : ''}`}
        ref={(node) => { this.node = node; }}
      >
        {options.map((option: Option, index: number) => (
          <span
            key={index}
            onClick={option.options
              ? () => this.onSelectValue(option.value)
              : () => this.onSelectValue(option.value)
            }
            onKeyPress={option.options
              ? () => this.onSelectValue(option.value)
              : () => this.onSelectValue(option.value)
            }
            role='menuitem'
            tabIndex={showOptionsLevel > 0 ? 0 : -1}
          >
            {option.display}
          </span>
        ))}
      </div>
    );
  }

  render() {
    const {
      id, label, className, required, options,

      forceInlineRequired, forceMessageBeneath,

      message, messageType, messagesArray,

      leftIcon, rightIcon, editable, disabled, value, type,
      onFocus, onBlur, onChange, onSelect,


      ...otherProps
    } = this.props;

    let newClassName = className || '';
    newClassName = `${newClassName} ${!editable ? 'blocked' : ''}`;

    // TODO: Change for react-autocomplete
    return (
      <InputAtom
        id={id} label={label}
        messagesArray={messagesArray}
        message={message}
        messageType={messageType}
        forceInlineRequired={forceInlineRequired}
        forceMessageBeneath={forceMessageBeneath}
        className={`datalist ${className}`}
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
        <input
          {...otherProps}
          ref={(input) => { this.inputElement = input; }}
          type={
            type === 'float' ? 'number' : type
          } id={`${id}`}
          value={value || ''}
          onChange={this.onHTMLInputChange}
          className={newClassName}
          required={required}
          disabled={disabled || !editable}
        />
        { this.renderOptions() }
      </InputAtom>
    );
  }
}