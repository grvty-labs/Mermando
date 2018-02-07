// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Label from './label';

export type Props = {
  id: string,
  label?: string | React.Node,
  readOnly?: boolean,
  value: boolean,
  onChange: Function,
};

type Default = {
  readOnly: boolean,
}

export default class Checkbox extends React.PureComponent<Props, void> {
  static defaultProps: Default = {
    readOnly: false,
  };

  @autobind
  onValueChange(event: SyntheticInputEvent<*>) {
    this.props.onChange(event.target.checked);
  }

  render() {
    const {
      id,
      label,
      value,
      readOnly,
      ...otherProps
    } = this.props;

    return (
      <div className='checkbox'>
        <input
          {...otherProps}
          readOnly={readOnly || false}
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
