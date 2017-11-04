// @flow
import * as React from 'react';
import Label from './Label';

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
    } = this.props;

    return (
      <div className='checkbox' >
        <input type='checkbox' id={id} checked={value} onChange={this.onValueChange} />
        <Label htmlFor={id} />
      </div>
    );
  }
}
