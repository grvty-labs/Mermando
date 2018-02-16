// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import classnames from 'classnames';
import Label from './label';

export type RadioType = {
  label: string,
  option: string | number,
  disabled?: boolean,
  legend?: string,
};

export type StoreProps = {
  id: string | number,
  value: string | number,
  name?: string,
} & RadioType;
export type Actions = {
  onChange: Function,
};
export type Props = StoreProps & Actions;
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
  onChange(e: SyntheticEvent<*>) {
    if (e) e.stopPropagation();
    const { onChange, option } = this.props;
    onChange(option);
  }

  render() {
    const {
      id, name, option, label, legend, value, disabled,
    } = this.props;
    return (
      <div className={classnames('radio', { disabled })}>
        <input
          type='radio'
          id={id}
          name={name}
          value={option}
          checked={value === option}
          readOnly={disabled}
          onChange={disabled ? undefined : this.onChange}
        />
        <Label htmlFor={`${id}`} />
        <Label htmlFor={`${id}`}>{label}</Label>
        <span className='legend'>{legend}</span>
      </div>
    );
  }
}
