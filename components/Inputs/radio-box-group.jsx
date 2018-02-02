// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import RadioBox from './radio-box';
import type { RadioType } from './radio-box';

export type StoreProps = {
  id: string | number,
  value: string | number,
  options: Array<RadioType>,
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
      <RadioBox
        key={newId}
        id={newId}
        name={`${id}`}
        value={value}
        label={radioData.label}
        option={radioData.option}
        legend={radioData.legend}
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
