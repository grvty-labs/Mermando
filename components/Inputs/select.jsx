// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Label from './label';

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
  messageType?: 'info' | 'subtle' | 'success' | 'error',
  className?: string,
  value: Value,
  onChange: Function,

  leftIcon?: string,
  rightIcon?: string,

  options: Array<Options>,
  placeholder: string,
  type?: 'single' | 'multiple',
  required?: boolean,
  editable?: boolean,
  disabled?: boolean,
};

type Default = {
  label: string,
  className: string,

  message: string,
  messageType: 'info' | 'subtle' | 'success' | 'error',

  leftIcon: string,
  rightIcon: string,

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
    messageType: 'info',

    leftIcon: '',
    rightIcon: '',

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
        document.removeEventListener('click', this.handleOutsideClick, false);
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
    const { type, value } = this.props;
    if (type === 'multiple') {
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
    if (this.state.showOptionsLevel === 0) {
      document.addEventListener('click', this.handleOutsideClick, false);
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
    document.removeEventListener('click', this.handleOutsideClick, false);
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
            tabIndex={0}
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
      options, placeholder, type, value,
    } = this.props;
    if (type === 'single' && value) {
      const option = options.find(opt => value === opt.value);
      return (
        <div className='value single'><span>{option ? option.display : value}</span></div>
      );
    } else if (value.constructor === Array && value.length > 0) {
      const casted = (value: Array<string | number>);
      const optsFiltered = options.filter(opt => casted.indexOf(opt.value) > -1);
      return (
        <div className='value multiple'>
          {optsFiltered.map((opt, i) => (
            <span
              key={i}
              onClick={() => this.onRemoveIndex(i)}
              onKeyPress={() => this.onRemoveIndex(i)}
              tabIndex={0}
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

  @autobind
  renderMessages() {
    const {
      label,
      required,
      message,
      messageType,
    } = this.props;
    if (label && (message || required)) {
      return (
        <small className={`symbolicon ${messageType || 'required'}`}>
          {message || 'Required field'}
        </small>
      );
    }
    return null;
  }

  render() {
    const {
      id,
      label,
      className,

      messageType,

      leftIcon,
      editable,
      disabled,
    } = this.props;


    return (
      <div className={`input-atom ${!editable ? 'blocked' : ''} ${className || ''}`}>
        { label ? <Label htmlFor={id}>{label}</Label> : null}
        <div
          className={
            `input-group ${leftIcon ? 'l-icon' : ''} r-icon
            ${messageType === 'error' ? 'error' : ''}`
          }
          onClick={this.handleClick}
          onKeyPress={this.handleClick}
          tabIndex={0}
          role='button'
        >
          <div
            id={id}
            className={`select ${disabled || !editable ? 'disabled' : ''}`}
          >
            { this.renderValue() }
            { this.renderOptions() }
          </div>
          <span className={`symbolicon ${leftIcon || 'none'}`} />
          <span className='symbolicon angle' />
        </div>
        {this.renderMessages()}
      </div>
    );
  }
}
