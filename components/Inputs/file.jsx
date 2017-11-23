// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import InputAtom from './input-atom';
import { messageTypes } from '../../js/inputs';

export type FileType = {
  data: string,
  filename: string,
  filetype: string,
};

type Props = {
  id: string,
  label?: string,
  message?: string,
  messageType?: $Keys<typeof messageTypes>,
  forceMessageBeneath?: boolean,
  className?: string,
  value?: FileType | Array<FileType>,

  rightIcon?: string,

  type?: 'single' | 'multiple',
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

  rightIcon: string,

  type: 'single' | 'multiple',
  required: boolean,
  forceInlineRequired: boolean,
  editable: boolean,
  disabled: boolean,
};

export default class Input extends React.PureComponent<Props, void> {
  static defaultProps: Default = {
    label: '',
    className: '',

    message: '',
    messageType: 'text',
    forceMessageBeneath: false,

    rightIcon: '',

    required: false,
    forceInlineRequired: false,
    disabled: false,
    editable: true,
    type: 'single',
  };

  @autobind
  onSelectValue(event: SyntheticEvent<*>) {
    const { type, value } = this.props;
    const { files } = event.target;

    if (!files || files.length < 0) {
      return;
    }

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (upload) => {
      const fileData = {
        data: upload.target.result,
        filename: file.name,
        filetype: file.type,
      };
      if (type === 'single') {
        this.props.onChange(fileData);
      } else {
        const casted = value && value.length > 0
          ? (value: Array<FileType>)
          : [];
        this.props.onChange(casted.concat(fileData));
      }
    };


    reader.readAsDataURL(file);
  }

  @autobind
  onRemoveIndex(index: number = 0) {
    const { type, value } = this.props;
    if (type === 'multiple') {
      const casted = (value: Array<FileType>);
      if (index >= 0) {
        casted.splice(index, 1);
        this.props.onChange(casted);
      }
    } else {
      this.props.onChange(undefined);
    }
  }

  @autobind
  renderValue() {
    const { type, value } = this.props;
    let fileRender;
    if (type === 'single' && value) {
      return (
        <div className='files single'>
          <span
            onClick={() => this.onRemoveIndex()}
            onKeyPress={() => this.onRemoveIndex()}
            tabIndex={0}
            role='menuitem'
          >
            {value.filename}
          </span>
        </div>
      );
    } else if (value && value.constructor === Array && value.length > 0) {
      const casted = (value: Array<FileType>);
      return (
        <div className='files multiple'>
          {casted.map((file, i) => (
            <span
              key={i}
              onClick={() => this.onRemoveIndex(i)}
              onKeyPress={() => this.onRemoveIndex(i)}
              tabIndex={0}
              role='menuitem'
            >
              {file.filename}
            </span>
          ))}
        </div>
      );
    }

    return null;
  }

  render() {
    const {
      id, label, forceInlineRequired,
      required, type, value,
      className, forceMessageBeneath, message, messageType,

      rightIcon, editable, placeholder,
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
        leftIcon='cloud-upload'
        rightIcon={rightIcon}
        required={required}
      >
        <div className='file'>
          <label htmlFor={id}>
            {placeholder}
          </label>
          <input
            {...otherProps}
            id={id}
            type='file'
            value=''
            onChange={this.onSelectValue}
          />
        </div>
        { this.renderValue() }
      </InputAtom>
    );
  }
}
