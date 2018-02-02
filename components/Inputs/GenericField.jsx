// @flow
import * as React from 'react';
import { Input, FileInput, SelectInput, CheckboxInput, RadioInputGroup } from '../../components/Inputs';
import type { Props as InputProps } from './input';
import type { Props as FileInputProps } from './file';
import type { Props as SelectInputProps } from './select';
import type { Props as CheckboxInputProps } from './checkbox';
import type { Props as RadioInputGroupProps } from './radio';
import { simpleInputTypes } from '../../js/inputs';

type DUFileInputProps = {
  fieldType: 'file',
} & FileInputProps;
type DUSelectInputProps = {
  fieldType: 'select',
} & SelectInputProps;
type DUCheckboxInputProps = {
  fieldType: 'checkbox',
} & CheckboxInputProps;
type DURadioInputGroupProps = {
  fieldType: 'radio',
} & RadioInputGroupProps;
type DUInputProps = {
  fieldType?: $Keys<typeof simpleInputTypes>
} & InputProps;

type Props = |
  DUFileInputProps |
  DUSelectInputProps |
  DUCheckboxInputProps |
  DURadioInputGroupProps |
  DUInputProps;

export default class GenericField extends React.PureComponent<Props, void> {
  render() {
    switch (this.props.fieldType) {
      case 'file':
        return (
          <FileInput {...this.props} />
        );
      case 'select':
        return (
          <SelectInput {...this.props} />
        );
      case 'checkbox':
        return (
          <CheckboxInput {...this.props} />
        );
      case 'radio':
        return (
          <RadioInputGroup {...this.props} />
        );
      default:
        return (
          <Input {...this.props} />
        );
    }
  }
}
