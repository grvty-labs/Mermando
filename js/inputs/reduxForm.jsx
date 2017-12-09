// @flow
import * as React from 'react';
import type { FieldProps } from 'redux-form';

import { Input, FileInput, SelectInput, CheckboxInput, RadioInputGroup } from '../../components/Inputs';

function renderInput(field: FieldProps) {
  const {
    input, type, specType, messageType, message,
    meta: { error, warning }, ...rest
  } = field;
  const mermandoFieldProps = {
    id: input.name,
    value: input.value,
    onChange: input.onChange,
    messageType: error
      ? 'error'
      : warning
        ? 'info'
        : messageType,
    message: error || warning || message,
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

export default renderInput;
