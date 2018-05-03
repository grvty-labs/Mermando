// @flow
import React, { Component } from 'react';

type Values = {
  start: number,
  end: number,
}

type Props = {
  values: Values,
  min: number,
  max: number,
  step: number,
  onChange: Function,
};

type State = {
  start: number,
  end: number,
};

export default class SliderMulti extends Component<Props, State> {
  static defaultProps = {
    values: {
      start: 1,
      end: 9,
    },
    step: 1,
    min: 0,
    max: 10,
    onChange: () => {},
  };

  constructor(props: Props) {
    super(props);
    this.range_min = React.createRef();
    this.range_max = React.createRef();
  }

  state: State = {
    start: 0,
    end: 0,
  };

  componentWillReceiveProps(nextProps: Props) {
    const { values: { start, end } } = nextProps;
    this.setState({ start, end });
  }

  setMinMax() {
    const start = Number(this.range_min.current.value);
    const end = Number(this.range_max.current.value);
    this.setState(
      (start <= end)
        ? { start, end }
        : { start: end, end: start },
      () => this.triggerOnChange(),
    );
  }

  triggerOnChange() {
    const { onChange } = this.props;
    const { start, end } = this.state;
    onChange({ start, end });
  }

  render() {
    const { start, end } = this.state;
    const { max, min, step } = this.props;
    return (
      <div>
        <input
          ref={this.range_min}
          className='slider-multi'
          type='range'
          multiple
          min={min}
          step={step}
          max={max}
          defaultValue={start}
          onInput={() => this.setMinMax()}
          values={{ start, end }}
        />
        <input
          ref={this.range_max}
          className='slider-multi'
          type='range'
          multiple
          min={min}
          step={step}
          max={max}
          defaultValue={end}
          onInput={() => this.setMinMax()}
          values={{ start, end }}
        />
      </div>
    );
  }
}
