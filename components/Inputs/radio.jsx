// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Label from './label';

export type RadioType = {
  label: string,
  option: string | number,
  legend?: string,
};

export type StoreProps = {
  id: string,
  value: string,
  name?: string,
} & RadioType;
export type Actions = {
  onChange: Function,
};
type Props = StoreProps & Actions;
type State = {};
type Default = {
  name: string,
};

export default class RadioInput extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    name: 'main',
  };
  state: State = {};

  @autobind
  onChange(event: SyntheticInputEvent<*>) {
    const { onChange } = this.props;
    const { value } = event.target;
    onChange(value);
  }

  render() {
    const {
      id, name, option, label, legend, value,
    } = this.props;
    return (
      <div className='radio'>
        <input
          type='radio'
          id={id}
          name={name}
          value={option}
          checked={value === option}
          onChange={this.onChange}
        />
        <Label htmlFor={id} />
        <Label htmlFor={id}>{label}</Label>
        <span className='legend'>{legend}</span>
      </div>
    );
  }
}
