// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Label from './label';

export type Props = {
  id: string,
  label?: string,
  value: boolean,
  onChange: Function,
};

export default class Checkbox extends React.PureComponent<Props, void> {
  @autobind
  onValueChange(event: SyntheticInputEvent<*>) {
    this.props.onChange(event.target.checked);
  }

  render() {
    const {
      id,
      label,
      value,
      ...otherProps
    } = this.props;

    return (
      <div className='checkbox'>
        <input
          {...otherProps}
          type='checkbox'
          id={id} checked={value}
          onChange={this.onValueChange}
        />
        <Label htmlFor={id} />
        <Label htmlFor={id}>{label}</Label>
      </div>
    );
  }
}
