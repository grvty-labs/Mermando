// @flow
import * as React from 'react';
import { Input, FileInput, SelectInput, CheckboxInput, RadioInputGroup } from '../../components/Inputs';
import type { Props as InputProps } from './input';
import type { Props as FileInputProps } from './file';
import type { Props as SelectInputProps } from './select';
import type { Props as CheckboxInputProps } from './checkbox';
import type { Props as RadioInputGroupProps } from './radio';

type Props = |
  InputProps |
  FileInputProps |
  SelectInputProps |
  CheckboxInputProps |
  RadioInputGroupProps;

export default class GenericField extends React.PureComponent<Props, void> {
  render() {
    const {
      id, type, specType, messageType, message, ...rest
    } = this.props;
    const mermandoFieldProps = {
      id: id || name,
      value: input.value,
      onChange: input.onChange,
      messageType,
      message,
      type: specType || type,
      ...rest,
    };
    if (type === 'file') {
      return (
        <FileInput {...mermandoFieldProps} />
      );
    } else if (type === 'select') {
      return (
        <SelectInput {...mermandoFieldProps} />
      );
    } else if (type === 'checkbox') {
      return (
        <CheckboxInput {...mermandoFieldProps} />
      );
    } else if (type === 'radio') {
      return (
        <RadioInputGroup {...mermandoFieldProps} />
      );
    }
    return (
      <Input {...mermandoFieldProps} />
    );
  }
}
