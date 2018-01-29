// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';

export type RadioType = {
  label: string,
  option: string | number,
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

export default class RadioBox extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    name: 'main',
  };
  state: State = {};

  @autobind
  onChange() {
    const { onChange, option } = this.props;
    onChange(option);
  }

  render() {
    const {
      id, name, option, label, legend, value,
    } = this.props;
    return (
      <div className='radio-box'>
        <label>
          <input
            type='radio'
            id={id}
            name={name}
            value={option}
            checked={value === option}
            onChange={this.onChange}
          />
          <div className='box'>
            <span className='label'>{label}</span>
            <span className='legend'>{legend}</span>
          </div>
        </label>
      </div>
    );
  }
}
