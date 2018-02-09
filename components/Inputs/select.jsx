// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import classnames from 'classnames';
import { messageTypes } from '../../js/inputs';
import InputAtom from './input-atom';
import type { Message } from './input-atom';

type param = string | number;
export type Value = param | param[];

export type Option = {
  display: param,
  value: param,
  disabled?: boolean,
  hover?: string,
  options?: Option[],
};

export type Props = {
  id: string,
  label?: string,
  messagesArray?: Message[],
  message?: string,
  messageType?: $Keys<typeof messageTypes>,
  className?: string,
  value?: Value,

  leftIcon?: string,

  type?: 'single' | 'multiple',
  options: Option[],
  placeholder?: string,
  required?: boolean,
  editable?: boolean,
  disabled?: boolean,

  onChange?: Function,
  onFocus?: Function,
  onBlur?: Function,
};

type Default = {
  label: string,
  className: string,

  messagesArray: Message[],
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
  onSelectValue(event: SyntheticEvent<*>, newValue: param) {
    if (event) event.stopPropagation();
    const { type, value, onChange } = this.props;
    if (onChange) {
      if (type === 'single') {
        this.setState({ showOptionsLevel: 0 }, () => {
          onChange(newValue);
          document.removeEventListener('click', this.handleOutsideClick);
        });
      } else {
        const casted = value && value.length
          ? (value: param[])
          : [];
        if (casted.indexOf(newValue) < 0) {
          onChange(casted.concat(newValue));
        }
      }
    }
  }

  @autobind
  onRemoveIndex(index: number) {
    const {
      editable, disabled, type, value, onChange,
    } = this.props;

    if (onChange) {
      if (type === 'multiple' && editable && !disabled) {
        const casted = value && value.length
          ? (value: param[])
          : [];
        if (index >= 0) {
          onChange([
            ...casted.slice(0, index),
            ...casted.slice(index + 1),
          ]);
        }
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
        className={classnames('options', { open: showOptionsLevel > 0 })}
        ref={(node) => { this.node = node; }}
      >
        { options.map((option: Option, index: number) => (
          <span
            key={index}
            className={classnames({ disabled: option.disabled })}
            onClick={option.disabled
              ? undefined
              : option.options
                ? e => this.onSelectValue(e, option.value)
                : e => this.onSelectValue(e, option.value)
            }
            onKeyPress={option.disabled
              ? undefined
              : option.options
                ? e => this.onSelectValue(e, option.value)
                : e => this.onSelectValue(e, option.value)
            }
            role='menuitem'
            tabIndex={!option.disabled && showOptionsLevel > 0 ? 0 : -1}
            title={option.hover}
          >
            {option.display}
          </span>
        ))
        }
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
        ? (value: param[])
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
          className={classnames('select-input', { disabled, blocked: !editable })}
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
