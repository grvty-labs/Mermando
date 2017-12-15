// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Dropzone from 'react-dropzone';
import InputAtom from './input-atom';
import { messageTypes } from '../../js/inputs';

export type FileType = {
  lastModified: number,
  lastModifiedDate: Date,
  name: string,
  preview: string,
  size: number,
  type: string,
  webkitRelativePath: string,
};

type Props = {
  id: string,
  label?: string,
  message?: string,
  messageType?: $Keys<typeof messageTypes>,
  forceMessageBeneath?: boolean,
  className?: string,
  +value?: FileType | Array<FileType>,

  rightIcon?: string,

  type?: 'single' | 'multiple',
  previewType?: 'filename' | 'image',
  placeholder?: string,
  acceptedExtensions?: string,
  required?: boolean,
  forceInlineRequired?: boolean,
  editable?: boolean,
  disabled?: boolean,

  onChange?: Function,
  onZoomClick?: Function,
};

type Default = {
  label: string,
  className: string,

  message: string,
  messageType: $Keys<typeof messageTypes>,
  forceMessageBeneath: boolean,

  rightIcon: string,

  type: 'single' | 'multiple',
  previewType: 'filename' | 'image',
  required: boolean,
  forceInlineRequired: boolean,
  editable: boolean,
  disabled: boolean,

  onChange: Function,
};

export default class FileInput extends React.PureComponent<Props, void> {
  static defaultProps: Default = {
    label: '',
    className: '',

    message: '',
    messageType: 'text',
    forceMessageBeneath: false,

    rightIcon: '',

    type: 'single',
    previewType: 'filename',
    required: false,
    forceInlineRequired: false,
    disabled: false,
    editable: true,

    onChange: () => {},
  };

  @autobind
  onSelectValue(acceptedFiles: Array<FileType>, rejectedFiles: Array<FileType>) {
    const {
      disabled, editable, type, value, onChange,
    } = this.props;

    if (!disabled && editable) {
      if (type === 'single' && acceptedFiles.length >= 1) {
        onChange(acceptedFiles[0]);
      } else if (type === 'multiple' && acceptedFiles.length >= 1) {
        const casted = value && value.length > 0
          ? (value: Array<FileType>)
          : [];
        onChange(casted.concat(acceptedFiles));
      }
    }
  }

  @autobind
  onRemoveIndex(index: number = 0) {
    const {
      disabled, editable, type, value, onChange,
    } = this.props;
    if (!disabled && editable) {
      if (type === 'multiple') {
        const casted = (value: Array<FileType>);
        if (index >= 0 && index < casted.length) {
          onChange([
            ...casted.slice(0, index),
            ...casted.slice(index + 1),
          ]);
        }
      } else {
        onChange(undefined);
      }
    }
  }

  @autobind
  renderSinglePreview(file: FileType, index: number = 0) {
    const {
      disabled, editable, onZoomClick, previewType,
    } = this.props;
    if (!editable) {
      if (previewType === 'image') {
        return (
          <div className='img' key={index}>
            <img
              src={file.preview}
              alt={file.name}
            />
            <span className='tag'>{index === 0 ? 'Main Image' : ''}</span>
            <div
              className='overlay'
              onClick={onZoomClick ? onZoomClick : () => {}} // eslint-disable-line
              onKeyPress={onZoomClick ? onZoomClick : () => {}} // eslint-disable-line
              role='button'
              tabIndex={0}
            >
              <span className='symbolicon zoom' />
            </div>
          </div>
        );
      }
      return (
        <a
          key={index}
          href={file.preview}
          target='_blank'
        >
          {file.name}
        </a>
      );
    }
    if (previewType === 'image') {
      return (
        <div className='img' key={index}>
          <img
            src={file.preview}
            alt={file.name}
          />
          <span className='tag'>{index === 0 ? 'Main Image' : null}</span>
          <span
            className={`remove-btn ${disabled ? 'disabled' : ''}`}
            onClick={() => this.onRemoveIndex(index)}
            onKeyPress={() => this.onRemoveIndex(index)}
            tabIndex={!disabled && editable ? 0 : -1}
            role='button'
            title='Remove from selection'
          />
        </div>
      );
    }
    return (
      <span key={index}>
        {file.name}
        <span
          className='remove-btn'
          onClick={() => this.onRemoveIndex(index)}
          onKeyPress={() => this.onRemoveIndex(index)}
          tabIndex={!disabled && editable ? 0 : -1}
          role='button'
          title='Remove from selection'
        />
      </span>
    );
  }

  @autobind
  renderValues() {
    const { previewType, type, value } = this.props;
    if (value) {
      if (type === 'single' && value && value.constructor !== Array) {
        const casted = (value: FileType);
        return (
          <div className={`attachment single ${previewType === 'image' ? 'grid' : ''}`}>
            { this.renderSinglePreview(casted) }
          </div>
        );
      } else if (type === 'multiple' && value && value.constructor === Array && value.length > 0) {
        const casted = (value: Array<FileType>);
        return (
          <div className={`attachment multiple ${previewType === 'image' ? 'grid' : ''}`}>
            { casted.map(this.renderSinglePreview) }
          </div>
        );
      }
    }

    return null;
  }

  @autobind
  renderPlaceholder(values: { isDragActive: boolean, isDragAccept: boolean }) {
    const { type, placeholder } = this.props;
    let placeholderMessage = placeholder;
    if (values.isDragActive) {
      if (values.isDragAccept) {
        placeholderMessage = type === 'multiple'
          ? 'All files will be accepted'
          : 'The file will be accepted';
      } else {
        placeholderMessage = type === 'multiple'
          ? 'One or multiple files will be rejected'
          : 'The file will be rejected';
      }
    }
    return (<span className='placeholder'>{placeholderMessage}</span>);
  }

  render() {
    const {
      id, label, forceInlineRequired,
      required, type, acceptedExtensions,
      className, forceMessageBeneath, message, messageType,
      rightIcon, editable, disabled, value,
    } = this.props;


    return (
      <InputAtom
        id={id}
        label={label}
        message={message}
        messageType={messageType}
        forceInlineRequired={forceInlineRequired}
        forceMessageBeneath={forceMessageBeneath}
        className={className}
        type='file'
        rightIcon={rightIcon}
        required={required}
        readOnly={!editable}
        disabled={disabled}
        empty={!value || (value.constructor === Array && value.length === 0)}
        invalid={messageType === 'error'}
        footer={
          editable
            ? this.renderValues()
            : undefined
        }
      >
        <Dropzone
          className='file-input'
          disabled={disabled || !editable}
          multiple={type === 'multiple'}
          activeClassName='active'
          acceptClassName='accept'
          disabledClassName='disabled'
          rejectClassName='reject'
          accept={acceptedExtensions}
          onDrop={this.onSelectValue}
        >
          {!editable
            ? this.renderValues()
            : this.renderPlaceholder
          }
        </Dropzone>
      </InputAtom>
    );
  }
}
