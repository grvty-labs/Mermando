// @flow
import CheckboxInput from './checkbox';
import FileInput from './file';
import FormSection from './formSection';
import Input from './input';
import InputsWrap from './inputsWrap';
import Label from './label';
import SelectInput from './select';

import type { TagType as TagValue } from './input';
import type { Value as SelectValue } from './select';
import type { FileType as FileValue } from './file';

export default Input;
export {
  CheckboxInput,
  FileInput,
  FormSection,
  Input,
  InputsWrap,
  Label,
  SelectInput,
};

export type {
  SelectValue,
  FileValue,
  TagValue,
};
