// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Dropzone from 'react-dropzone';
import ImageCompressor from 'image-compressor.js';
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

export type Props = {
  id: string,
  label?: string,

  compress?: boolean,
  compressOptions?: any,

  messagesArray?: Message[],
  message?: string,
  messageType?: $Keys<typeof messageTypes>,
  forceMessageBeneath?: boolean,
  className?: string,
  +value?: FileType | FileType[],

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

  compress: boolean,
  compressOptions: any,

  messagesArray: Message[],
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

    compress: false,
    compressOptions: {
      quality: 0.6,
      maxWidth: 1000,
      convertSize: 100000,
    },

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
  onSelectValue(acceptedFiles: FileType[]) {
    const {
      type, value = [], onChange,
      compress, compressOptions,
    } = this.props;

    if (onChange && !this.props.disabled && this.props.editable) {
      if (type === 'single' && acceptedFiles && acceptedFiles.length && acceptedFiles[0]) {
        if (compress) {
          new ImageCompressor(acceptedFiles[0], {
            ...compressOptions,
            success: (result) => {
              const file = new File([result], result.name, { type: result.type, lastModified: Date.now() });
              result.preview = URL.createObjectURL(file);
              onChange(result);
            },
          });
        } else {
          onChange(acceptedFiles[0]);
        }
      } else if (type === 'multiple' && acceptedFiles && acceptedFiles.length) {
        const casted = value && value.constructor === Array && value.length
          ? (value: FileType[])
          : [];
        if (acceptedFiles && acceptedFiles.length && acceptedFiles[0]) {
          if (compress) {
            let newValue = [...value];
            acceptedFiles.forEach((file) => {
              new ImageCompressor(file, {
                ...compressOptions,
                success: (result) => {
                  const file = new File([result], result.name, { type: result.type, lastModified: Date.now() });
                  result.preview = URL.createObjectURL(file);
                  newValue = [
                    ...newValue,
                    result,
                  ];
                  onChange(newValue);
                },
              });
            });
          } else {
            onChange(casted.concat(acceptedFiles));
          }
        }
      }
    }
  }

  @autobind
  onRemoveIndex(index: number = 0) {
    const {
      value, onChange,
    } = this.props;
    if (onChange && !this.props.disabled && this.props.editable) {
      if (this.props.type === 'multiple') {
        const casted = value && value.constructor === Array && value.length
          ? (value: FileType[])
          : [];
        if (index >= 0 && index < casted.length) {
          onChange([
            ...casted.slice(0, index),
            ...casted.slice(index + 1),
          ], casted[index]);
        }
      } else {
        onChange(undefined);
      }
    }
  }

  @autobind
  renderSinglePreview(file: FileType, index: number = 0) {
    const {
      disabled, editable, onZoomClick,
    } = this.props;

    if (!editable) {
      if (this.props.previewType === 'image') {
        return (
          <div className='img' key={index}>
            <img
              src={file.preview}
              alt={file.name}
            />
            <span className='tag'>{index === 0 && !this.props.hidePreviewTag ? 'Main Image' : ''}</span>
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
    if (this.props.previewType === 'image') {
      return (
        <div className='img' key={index}>
          <img
            src={file.preview}
            alt={file.name}
          />
          <span className='tag'>{index === 0 && !this.props.hidePreviewTag ? 'Main Image' : ''}</span>
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
        const casted = (value: FileType[]);
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
    const { type } = this.props;
    let placeholderMessage;
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
    } else {
      placeholderMessage = this.props.placeholder || (
        this.props.previewType === 'images'
          ? type === 'multiple'
            ? 'Drag & Drop your images here'
            : 'Drag & Drop your image here'
          : type === 'multiple'
            ? 'Drag & Drop your files here'
            : 'Drag & Drop your file here');
    }
    return (<span className='placeholder'>{placeholderMessage}</span>);
  }

  render() {
    const {
      messageType, editable, disabled, value,
    } = this.props;

    return (
      <InputAtom
        id={this.props.id}
        label={this.props.label}
        messagesArray={this.props.messagesArray}
        message={this.props.message}
        messageType={this.props.messageType}
        forceInlineRequired={this.props.forceInlineRequired}
        forceMessageBeneath={this.props.forceMessageBeneath}
        className={this.props.className}
        type='file'
        rightIcon={this.props.rightIcon}
        required={this.props.required}
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
          multiple={this.props.type === 'multiple'}
          activeClassName='active'
          acceptClassName='accept'
          disabledClassName='disabled'
          rejectClassName='reject'
          accept={this.props.acceptedExtensions}
          onDrop={chingo => this.onSelectValue(chingo)}
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
