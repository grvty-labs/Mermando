// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import RadioInput from './radio';
import type { RadioType } from './radio';

export type StoreProps = {
  id: string | number,
  value: string | number,
  options: RadioType[],
  className?: string,
  type?: 'column' | 'inline',
};
export type Actions = {
  onChange: Function,
};
type Props = StoreProps & Actions;
type State = {};
type Default = {
  className: string,
  type?: 'column' | 'inline',
};

export default class RadioInputGroup extends React.Component<Props, State> {
  static defaultProps: Default = {
    type: 'column',
    className: '',
  };
  state: State = {};

  @autobind
  renderRadio(radioData: RadioType, index: number) {
    const {
      id, onChange, value,
    } = this.props;
    const newId = `${id}-${index}`;
    return (
      <RadioInput
        {...radioData}
        key={newId}
        id={newId}
        name={`${id}`}
        value={value}
        onChange={onChange}
      />
    );
  }

  render() {
    const { options, type, className } = this.props;
    return (
      <div className={`radio-group ${type || ''} ${className || ''}`}>
        { options.map(this.renderRadio) }
      </div>
    );
  }
}
