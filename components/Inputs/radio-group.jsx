// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import RadioInput from './radio';
import type { RadioType } from './radio';

export type StoreProps = {
  id: string,
  value: string,
  options: Array<RadioType>,
};
export type Actions = {
  onChange: Function,
};
type Props = StoreProps & Actions;
type State = {};
type Default = {};

export default class RadioInputGroup extends React.PureComponent<Props, State> {
  static defaultProps: Default = {};
  state: State = {};

  @autobind
  renderRadio(radioData: RadioType, index: number) {
    const { id, onChange, value } = this.props;
    const newId = `${id}-${index}`;
    return (
      <RadioInput
        key={newId}
        id={newId}
        name={id}
        value={value}
        {...radioData}
        onChange={onChange}
      />
    );
  }

  render() {
    const { options } = this.props;
    return (
      <div className='radio-group'>
        { options.map(this.renderRadio) }
      </div>
    );
  }
}
