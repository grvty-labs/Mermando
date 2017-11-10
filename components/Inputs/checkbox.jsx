// @flow
import * as React from 'react';
import Label from './label';

type Props = {
  id: string,
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
      value,
      ...otherProps
    } = this.props;

    return (
      <div className='checkbox' >
        <input
          {...otherProps}
          type='checkbox'
          id={id} checked={value}
          onChange={this.onValueChange}
        />
        <Label htmlFor={id} />
      </div>
    );
  }
}
