// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Label from './label';

export type RadioType = {
  text: string,
  value: boolean,
};

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

export default class RadioInput extends React.PureComponent<Props, State> {
  static defaultProps: Default = {};
  state: State = {};

  renderRadio(radioData: RadioType, index: number) {
    const { id, value } = this.props;
    const newId = `${id}-${index}`;
    return (
      <div key={newId}>
        <input
          type='radio'
          id={newId}
          group={id}
          value={radioData.value}
          checked={radioData.value === value}
        />
        <Label htmlFor={newId}>{radioData.text}</Label>
      </div>
    );
  }

  render() {
    const { options } = this.props;
    return (
      <div className='radio'>
        { options.map(this.renderRadio) }
      </div>
    );
  }
}
