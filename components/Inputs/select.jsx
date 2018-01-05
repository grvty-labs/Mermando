// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import { messageTypes } from '../../js/inputs';
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
  value: Value,

  leftIcon?: string,

  type?: 'single' | 'multiple',
  options: Array<Option>,
  placeholder?: string,
  required?: boolean,
  editable?: boolean,
  disabled?: boolean,

  onChange: Function,
  onFocus?: Function,
  onBlur?: Function,
};

type Default = {
  label: string,
  className: string,

  messagesArray: Array<Message>,
  message: string,
  messageType: $Keys<typeof messageTypes>,

  leftIcon: string,

  required: boolean,
  editable: boolean,
  disabled: boolean,
  type: 'single' | 'multiple',
}

type State = {
  showOptionsLevel: number
};

export default class Select extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    label: '',
    className: '',

    messagesArray: [],
    message: '',
    messageType: 'text',

    leftIcon: '',

    required: false,
    disabled: false,
    editable: true,
    type: 'single',
  };

  state: State = {
    showOptionsLevel: 0,
  }

  componentDidMount() {
    const { options, required, value } = this.props;
    if (required && !value) {
      this.onSelectValue(options[0].value);
    }
  }

  @autobind
  onSelectValue(newValue: string | number) {
    const { type, value } = this.props;
    if (type === 'single') {
      this.setState({ showOptionsLevel: 0 }, () => {
        this.props.onChange(newValue);
        document.removeEventListener('click', this.handleOutsideClick);
      });
    } else {
      const casted = value && value.length
        ? (value: Array<string | number>)
        : [];
      if (casted.indexOf(newValue) < 0) {
        this.props.onChange(casted.concat(newValue));
      }
    }
  }

  @autobind
  onRemoveIndex(index: number) {
    const {
      editable, disabled, type, value,
    } = this.props;
    if (type === 'multiple' && editable && !disabled) {
      const casted = value && value.length
        ? (value: Array<string | number>)
        : [];
      if (index >= 0) {
        this.props.onChange([
          ...casted.slice(0, index),
          ...casted.slice(index + 1),
        ]);
      }
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

  @autobind
  renderValue() {
    const {
      options, placeholder, type, value, disabled, editable,
    } = this.props;
    if (type === 'single' && value) {
      const option = options.find(opt => value === opt.value);
      return (
        <div className='value single'><span>{option ? option.display : value}</span></div>
      );
    } else if (value && value.constructor === Array && value.length) {
      const casted = value && value.length
        ? (value: Array<string | number>)
        : [];
      const optsFiltered = options.filter(opt => casted.indexOf(opt.value) > -1);
      return (
        <div className='value multiple'>
          {optsFiltered.map((opt, i) => (
            <span key={i}>
              {opt.display}
              <span
                className='remove-btn'
                onClick={() => this.onRemoveIndex(i)}
                onKeyPress={() => this.onRemoveIndex(i)}
                tabIndex={!disabled && editable ? 0 : -1}
                role='button'
                title='Remove from selection'
              />
            </span>
          ))}
        </div>
      );
    }
    return (
      <div className='placeholder'>{placeholder || (type === 'single' ? 'Select...' : 'Select multiple...')}</div>
    );
  }

  render() {
    const {
      id, label, className, required,

      message, messageType, messagesArray,

      leftIcon, editable, disabled, value,
      onFocus, onBlur,
    } = this.props;

    // TODO: Change for react-autocomplete
    return (
      <InputAtom
        id={id} label={label}
        messagesArray={messagesArray}
        message={message}
        messageType={messageType}
        forceMessageBeneath
        className={className}
        leftIcon={leftIcon}
        required={required}
        type='select'
        readOnly={!editable}
        disabled={disabled}
        empty={!value || (value.constructor === Array && !value.length)}
        invalid={messageType === 'error'}
        onClick={this.handleClick}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <div
          id={id}
          className={`select-input ${disabled ? 'disabled' : ''} ${!editable ? 'blocked' : ''}`}
          tabIndex={!disabled && editable ? 0 : -1}
          role='button'
        >
          { this.renderValue() }
          { this.renderOptions() }
        </div>
      </InputAtom>
    );
  }
}
