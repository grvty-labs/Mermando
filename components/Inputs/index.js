// @flow
import CheckboxInput from './checkbox';
import FileInput from './file';
import FormSection from './formSection';
import Input from './input';
import InputsWrap from './inputsWrap';
import Label from './label';
import SelectInput from './select';
import RadioInputGroup from './radio-group';
import RadioInput from './radio';

import type { TagType as TagValue } from './input';
import type { Value as SelectValue, Option as SelectOption } from './select';
import type { FileType as FileValue } from './file';
import type { RadioType as RadioOption } from './radio';

export default Input;
export {
  CheckboxInput,
  FileInput,
  FormSection,
  Input,
  InputsWrap,
  Label,
  SelectInput,
  RadioInputGroup,
  RadioInput,
};

export type {
  SelectValue,
  SelectOption,
  FileValue,
  RadioOption,
  TagValue,
};
