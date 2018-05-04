// @flow
import React, { Component } from 'react';
import autobind from 'autobind-decorator';

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
    this.slider_l = React.createRef();
    this.slider_r = React.createRef();
  }

  state: State = {
    start: 0,
    end: 0,
  };

  componentWillMount() {
    const { values: { start, end } } = this.props;
    this.setState({ start, end });
  }

  componentWillReceiveProps(nextProps: Props) {
    const { values: { start, end } } = nextProps;
    this.setState({ start, end });
    this.renderHiglight();
  }

  @autobind
  setMinMax() {
    const start = Number(this.range_min.current.value);
    const end = Number(this.range_max.current.value);
    if (start === end) this.range_max.current.value = this.range_min.current.value;
    this.renderHiglight();
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

  // TODO: Take position of thumb instead percent
  renderHiglight() {
    const { max } = this.props;
    const { current: { value: min_value, offsetWidth: min_offset_width } } = this.range_min;
    const { current: { value: max_value, offsetWidth: max_offset_width } } = this.range_max;
    const start = Number(min_value);
    const end = Number(max_value);
    const val = (start <= end) ? start : end;
    const val2 = (start <= end) ? end : start;
    const offset = (start <= end) ? min_offset_width : max_offset_width;
    const slider_l = (val > 0) ? (val / max) * offset : 1;
    const slider_r = ((val2 / max) * offset === offset)
      ? 1
      : offset - ((val2 / max) * offset);
    this.slider_l.current.style.width = `${slider_l}px`;
    this.slider_r.current.style.width = `${slider_r}px`;
  }

  render() {
    const { start, end } = this.state;
    const { max, min, step } = this.props;
    return (
      <div>
        <div className='slider-multi slider'>
          <div ref={this.slider_l} className='slider-l' />
          <div className='slider-c' />
          <div ref={this.slider_r} className='slider-r' />
        </div>
        <input
          ref={this.range_min}
          className='slider-multi'
          type='range'
          min={min}
          step={step}
          max={max}
          defaultValue={start}
          onInput={() => this.setMinMax()}
        />
        <input
          ref={this.range_max}
          className='slider-multi'
          type='range'
          min={min}
          step={step}
          max={max}
          defaultValue={end}
          onInput={() => this.setMinMax()}
        />
      </div>
    );
  }
}
