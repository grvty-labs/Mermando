// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Dropzone from 'react-dropzone';
import InputAtom from '../Inputs/input-atom';
import Avatar from './avatar';
import { messageTypes } from '../../js/inputs';
import type { Message } from '../Inputs/input-atom';
import type { FileValue } from '../Inputs';

export type Props = {
  id: string,
  name: string,
  label?: string,
  messagesArray?: Message[],
  message?: string,
  messageType?: $Keys<typeof messageTypes>,
  forceMessageBeneath?: boolean,
  className?: string,
  +value?: FileValue,


  acceptedExtensions?: string,

  required?: boolean,
  forceInlineRequired?: boolean,
  editable?: boolean,
  disabled?: boolean,

  onChange?: Function,
};

type Default = {
  label: string,
  className: string,

  messagesArray: Message[],
  message: string,
  messageType: $Keys<typeof messageTypes>,
  forceMessageBeneath: boolean,


  acceptedExtensions: string,

  required: boolean,
  forceInlineRequired: boolean,
  editable: boolean,
  disabled: boolean,
};

export default class AvatarInput extends React.PureComponent<Props, void> {
  static defaultProps: Default = {
    label: '',
    className: '',

    messagesArray: [],
    message: '',
    messageType: 'text',
    forceMessageBeneath: false,

    acceptedExtensions: 'image/jpg, image/jpeg, image/png',

    required: false,
    forceInlineRequired: false,
    disabled: false,
    editable: true,
  };

  @autobind
  onSelectValue(acceptedFiles: FileValue[]) {
    const { onChange } = this.props;

    if (onChange && !this.props.disabled && this.props.editable) {
      if (acceptedFiles && acceptedFiles.length && acceptedFiles[0]) {
        onChange(acceptedFiles[0]);
      }
    }
  }

  @autobind
  renderPlaceholder(values: { isDragActive: boolean, isDragAccept: boolean }) {
    const { name, value } = this.props;

    return (
      <div className='preview'>
        <Avatar
          avatar={value && value.preview ? { src: value.preview } : undefined}
          name={name}
        />
        { values.isDragActive
          ? <div className={values.isDragAccept ? 'accepted' : 'rejected'} />
          : null }
      </div>
    );
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
        type='avatar'
        required={this.props.required}
        readOnly={!editable}
        disabled={disabled}
        empty={!value}
        invalid={messageType === 'error'}
      >
        <Dropzone
          className='avatar-input'
          disabled={disabled || !editable}
          multiple={false}
          activeClassName='active'
          acceptClassName='accept'
          disabledClassName='disabled'
          rejectClassName='reject'
          accept={this.props.acceptedExtensions}
          onDrop={this.onSelectValue}
        >
          {this.renderPlaceholder}
        </Dropzone>
      </InputAtom>
    );
  }
}
