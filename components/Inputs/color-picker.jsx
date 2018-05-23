// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import update from 'immutability-helper';
import { arrayHexToRgb, arrayRgbToHex } from 'hex2rgbcolor';
import type { RgbType } from 'hex2rgbcolor';
import InputAtom from './input-atom';
import { Button } from '../Button';

export type ColorType = {
  label: string,
  multiple?: boolean,
  editable?: boolean,
  disabled?: boolean,
  required?: boolean,
  resultType?: string,
  className?: string,
  value?: string,
  values?: string[] | RgbType[],
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
  values: string[],
};
type Default = {
  name: string,
};

export default class ColorPicker extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    onChange: () => {},
    name: 'main',
    multiple: false,
    values: [],
    value: '',
    resultType: 'hex',
  };
  state: State = {
    values: ['f9d939'],
  }

  componentWillMount() {
    const { values } = this.props;
    if (values) {
      if (typeof values[0] === 'object') {
        const v = arrayRgbToHex(values);
        this.setState({ values: v.map(i => i.replace('#', '')) });
      } else {
        this.setState({ values });
      }
    }
  }

  inputElement: ?any;

  renderColorPicker(index: number) {
    const {
      id, disabled, required, editable, className,
      onChange, multiple, resultType,
    } = this.props;

    let newClassName = className || '';
    newClassName = `${newClassName} ${!editable ? 'blocked' : ''}`;

    return (
      <div className='color-container' key={index}>
        {
          (editable) ? (
            <div className='delete'>
              <Button
                strain='icon'
                icon='cancel'
                onClick={() => {
                  const newState = update(this.state, { values: { $splice: [[index, 1]] } });
                  this.setState(newState, () => {
                    const results = resultType === 'hex' ? this.state.values : arrayHexToRgb(this.state.values);
                    onChange((multiple) ? results : results[0]);
                  });
                }}
              >
                delete
              </Button>
            </div>
          ) : null
        }
        <div className='color' style={{ backgroundColor: `#${this.state.values[index]}` }} />
        <div className='input-container'>
          <input
            ref={(input) => { this.inputElement = input; }}
            id={`${id}`}
            type='text'
            className={newClassName}
            value={this.state.values[index] || ''}
            maxLength={6}
            onChange={({ target: { value: valColor } }) => {
              const newState = update(this.state, { values: { [index]: { $set: valColor } } });
              this.setState(newState, () => {
                const results = resultType === 'hex' ? this.state.values : arrayHexToRgb(this.state.values);
                onChange((multiple) ? results : results[0]);
              });
            }}
            required={required}
            disabled={disabled || !editable}
            pattern={'[0-9A-Fa-f]{6}'}
          />
        </div>
      </div>
    );
  }

  render() {
    const {
      id, label, value, disabled, required, editable, className,
      onChange, multiple, resultType,
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
      >
        {
          values.map((val, index) => this.renderColorPicker(index))
        }
        {
          (multiple && editable) ? (
            <Button
              size='huge'
              strain='link'
              onClick={() => this.setState({ values: [...this.state.values, 'f9d939'] }, () => {
                const results = resultType === 'hex' ? this.state.values : arrayHexToRgb(this.state.values);
                onChange(results);
              })}
            >
              +
            </Button>) : null
        }
      </InputAtom>
    );
  }
}
