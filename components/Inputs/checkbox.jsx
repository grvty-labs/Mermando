// @flow
import * as React from 'react';
import Label from './label';

type Props = {
  id: string,
  label?: string,
  value: boolean,
  onChange: Function,
};

export default class Checkbox extends React.Component<Props, void> {
  constructor(props: Props) {
    super(props);
    (this: any).onValueChange = this.onValueChange.bind(this);
  }

  onValueChange(event: SyntheticEvent<*>) {
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
