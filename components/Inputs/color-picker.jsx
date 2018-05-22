// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import update from 'immutability-helper';
import InputAtom from './input-atom';
import { Button } from '../Button';

export type ColorType = {
  label: string,
  multiple?: boolean,
  editable?: boolean,
  disabled?: boolean,
  required?: boolean,
  className?: string,
  onChange: Function,
};

export type StoreProps = {
  id: string | number,
  value: string | number,
  name?: string,
} & ColorType;
export type Actions = {
  onChange: Function,
};
export type Props = StoreProps & Actions;
type State = {
  values: Array<string>,
};
type Default = {
  name: string,
};

export default class ColorPicker extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    onChange: () => {},
    name: 'main',
    multiple: false,
  };
  state: State = {
    values: ['f9d939'],
  };

  inputElement: ?any;

  renderColorPicker(index: number) {
    const {
      id, disabled, required, editable, className,
      onChange, multiple,
    } = this.props;

    let newClassName = className || '';
    newClassName = `${newClassName} ${!editable ? 'blocked' : ''}`;

    return (
      <div className='color-container' key={index}>
        <input
          ref={(input) => { this.inputElement = input; }}
          id={`${id}`}
          type='text'
          className={newClassName}
          value={this.state.values[index] || ''}
          onChange={({ target: { value: valColor } }) => {
            const newState = update(this.state, { values: { [index]: { $set: valColor } } });
            this.setState(newState, () => {
              onChange((multiple) ? this.state.values : this.state.values[0]);
            });
          }}
          required={required}
          disabled={disabled || !editable}
          pattern={'[0-9A-Fa-f]{6}'}
        />
        <div className='color' style={{ backgroundColor: `#${this.state.values[index]}` }}>
          <div className='delete' style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Button
              strain='icon'
              icon='cancel'
              // onClick={() => {
              //   this.setState({
              //     showLightbox: true,
              //     paymentDelete: method,
              //   });
              // }}
            >
              delete
            </Button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      id, name, label, value, disabled, required, editable, className,
      onChange, multiple,
    } = this.props;

    const { values } = this.state;

    let newClassName = className || '';
    newClassName = `${newClassName} ${!editable ? 'blocked' : ''}`;

    return (
      <InputAtom
        id={id}
        label={label}
        className={className}
        required={required}
        readOnly={!editable}
        disabled={disabled}
        empty={!value && value !== 0}
        // onClick={() => { if (this.inputElement) this.inputElement.focus(); }}
      >
        {
          values.map((val, index) => this.renderColorPicker(index))
        }
        {
          (multiple) ? (
            <Button
              size='small'
              strain='main'
              onClick={() => this.setState({ values: [...this.state.values, 'f9d939'] })}
              // disabled={!this.canSubmit()}
            >
              +
            </Button>) : null
        }
      </InputAtom>
    );
  }
}
