// @flow
import CheckboxInput from './checkbox';
import FileInput from './file';
import FormSection from './formSection';
import GenericField from './GenericField';
import Input from './input';
import InputsWrap from './inputsWrap';
import Label from './label';
import SelectInput from './select';
import RadioInputGroup from './radio-group';
import RadioInput from './radio';
import RadioBox from './radio-box';

import type { TagType as TagValue } from './input';
import type { Message as InputMessage } from './input-atom';
import type { Value as SelectValue, Option as SelectOption } from './select';
import type { FileType as FileValue } from './file';
import type { RadioType as RadioOption } from './radio';

export default Input;
export {
  CheckboxInput,
  FileInput,
  FormSection,
  GenericField,
  Input,
  InputsWrap,
  Label,
  SelectInput,
  RadioInputGroup,
  RadioInput,
  RadioBox,
};

export type {
  FileValue,
  InputMessage,
  RadioOption,
  SelectOption,
  SelectValue,
  TagValue,
};
