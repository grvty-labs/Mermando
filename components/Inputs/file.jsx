// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Dropzone from 'react-dropzone';
import Config from 'Config';
import InputAtom from './input-atom';
import { messageTypes } from '../../js/inputs';
import type { Message } from './input-atom';

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
  messagesArray?: Array<Message>,
  message?: string,
  messageType?: $Keys<typeof messageTypes>,
  forceMessageBeneath?: boolean,
  className?: string,
  +value?: FileType | Array<FileType>,

  rightIcon?: string,

  type?: 'single' | 'multiple',
  hidePreviewTag?: boolean,
  previewType?: 'filename' | 'image',
  acceptedExtensions?: string,

  placeholder?: string,
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

  messagesArray: Array<Message>,
  message: string,
  messageType: $Keys<typeof messageTypes>,
  forceMessageBeneath: boolean,

  rightIcon: string,

  type: 'single' | 'multiple',
  previewType: 'filename' | 'image',
  hidePreviewTag: boolean,

  required: boolean,
  forceInlineRequired: boolean,
  editable: boolean,
  disabled: boolean,
};

export default class FileInput extends React.PureComponent<Props, void> {
  static defaultProps: Default = {
    label: '',
    className: '',

    messagesArray: [],
    message: '',
    messageType: 'text',
    forceMessageBeneath: false,

    rightIcon: '',

    type: 'single',
    previewType: 'filename',
    hidePreviewTag: false,

    required: false,
    forceInlineRequired: false,
    disabled: false,
    editable: true,
  };

  @autobind
  onSelectValue(acceptedFiles: Array<FileType>) {
    const {
      disabled, editable, type, value, onChange,
    } = this.props;

    if (onChange && !disabled && editable) {
      if (type === 'single' && acceptedFiles && acceptedFiles.length && acceptedFiles[0]) {
        onChange(acceptedFiles[0]);
      } else if (type === 'multiple' && acceptedFiles && acceptedFiles.length) {
        const casted = value && value.constructor === Array && value.length
          ? (value: Array<FileType>)
          : [];
        if (acceptedFiles && acceptedFiles.length && acceptedFiles[0]) {
          onChange(casted.concat(acceptedFiles));
        }
      }
    }
  }

  @autobind
  onRemoveIndex(index: number = 0) {
    const {
      disabled, editable, type, value, onChange,
    } = this.props;
    if (onChange && !disabled && editable) {
      if (type === 'multiple') {
        const casted = value && value.constructor === Array && value.length
          ? (value: Array<FileType>)
          : [];
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
      disabled, editable, onZoomClick, previewType, hidePreviewTag,
    } = this.props;
    if (!editable) {
      if (previewType === 'image') {
        return (
          <div className='img' key={index}>
            <img
              src={file.preview}
              alt={file.name}
            />
            <span className='tag'>{index === 0 && !hidePreviewTag ? 'Main Image' : ''}</span>
            <div
              className='overlay'
              onClick={onZoomClick ? onZoomClick : () => {}} // eslint-disable-line
              onKeyPress={onZoomClick ? onZoomClick : () => {}} // eslint-disable-line
              role='button'
              tabIndex={0}
            >
              <span className={`${Config.mermando.icons.classPrefix}${Config.mermando.icons.zoom}`} />
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
      } else if (type === 'multiple' && value && value.constructor === Array && value.length) {
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
      className, forceMessageBeneath, message, messageType, messagesArray,
      rightIcon, editable, disabled, value,
    } = this.props;


    return (
      <InputAtom
        id={id}
        label={label}
        messagesArray={messagesArray}
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
