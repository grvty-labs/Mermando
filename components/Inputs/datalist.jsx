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
  returnValueDisplay?: boolean,

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
  returnValueDisplay: boolean,

  required: boolean,
  editable: boolean,
  disabled: boolean,
  type: $Keys<typeof inputTypes>,
}

type State = {
  showOptionsLevel: number,
  filteredOptions: Option[],
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
    returnValueDisplay: false,

    placeholder: 'Start typing...',

    forceMessageBeneath: false,
    forceInlineRequired: false,


    required: false,
    disabled: false,
    editable: true,
    type: 'text',
  };

  state: State = {
    showOptionsLevel: 0,
    filteredOptions: [],
  }

  componentWillMount() {
    const { options } = this.props;

    if (options) {
      this.setState({
        filteredOptions: options,
      });
    }
  }

  componentDidMount() {
    const { options, required, value } = this.props;
    if (required && !value) {
      this.onSelectValue([options].value, [options].display);
    }
    document.addEventListener('keyup', this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeyPress);
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
        this.handleClick();
        clean = value;
        onChange(clean);
      }
    }
  }

  @autobind
  onSelectValue(newValue: string | number, newValueDisplay: string) {
    const {
      onSelect, returnValueDisplay,
    } = this.props;
    if (onSelect) {
      this.setState({ showOptionsLevel: 0 }, () => {
        if (returnValueDisplay) {
          onSelect(newValue, newValueDisplay);
        } else {
          onSelect(newValue);
        }
        document.removeEventListener('click', this.handleOutsideClick);
      });
    }
  }

  @autobind
  handleKeyPress(event) {
    const { value, options } = this.props;
    if (options) {
      const rex = new RegExp(value, 'i');
      const filtered = options.filter(o => rex.test(o.display));
      this.setState({
        filteredOptions: filtered,
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
    const { showOptionsLevel, filteredOptions } = this.state;
    return (
      <div
        className={`options ${showOptionsLevel > 0 ? 'open' : ''}`}
        ref={(node) => { this.node = node; }}
      >
        {this.state.filteredOptions.map((option: Option, index: number) => (
          <span
            key={index}
            onClick={option.options
              ? () => this.onSelectValue(option.value, option.display)
              : () => this.onSelectValue(option.value, option.display)
            }
            onKeyPress={option.options
              ? () => this.onSelectValue(option.value, option.display)
              : () => this.onSelectValue(option.value, option.display)
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
      onFocus, onBlur, onChange, onSelect, returnValueDisplay,


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
