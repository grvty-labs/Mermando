// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Label from './label';
import { messageTypes } from '../../js/inputs';
import InputAtom from './input-atom';

export type Value = string | number | Array<string | number>;

type Options = {
  display: string | number,
  value: string | number,
  options?: Array<Options>,
};

type Props = {
  id: string,
  label?: string,
  message?: string,
  messageType?: $Keys<typeof messageTypes>,
  className?: string,
  value: Value,

  leftIcon?: string,

  type?: 'single' | 'multiple',
  options: Array<Options>,
  placeholder?: string,
  required?: boolean,
  editable?: boolean,
  disabled?: boolean,

  onChange: Function,
};

type Default = {
  label: string,
  className: string,

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
      const casted = [...(value: Array<string | number>)];
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
      const casted = (value: Array<string | number>);
      if (index >= 0) {
        casted.splice(index, 1);
        this.props.onChange(casted);
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
  handleOutsideClick(e) {
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
        {options.map((option: Options, index: number) => (
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
    } else if (value && value.constructor === Array && value.length > 0) {
      const casted = (value: Array<string | number>);
      const optsFiltered = options.filter(opt => casted.indexOf(opt.value) > -1);
      return (
        <div className='value multiple'>
          {optsFiltered.map((opt, i) => (
            <span
              key={i}
              onClick={() => this.onRemoveIndex(i)}
              onKeyPress={() => this.onRemoveIndex(i)}
              tabIndex={!disabled && editable ? 0 : -1}
              role='menuitem'
            >
              {opt.display}
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
      id,
      label,
      className,
      required,

      message,
      messageType,

      leftIcon,
      editable,
      disabled,
    } = this.props;


    return (
      <InputAtom
        id={id} label={label}
        message={message}
        messageType={messageType}
        forceMessageBeneath
        className={className}
        leftIcon={leftIcon}
        required={required}
        rightIcon='angle'
      >
        <div
          id={id}
          className={`select ${disabled ? 'disabled' : ''} ${!editable ? 'blocked' : ''}`}
          onClick={this.handleClick}
          onKeyPress={this.handleClick}
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
