// @flow
import React, { PropTypes, Component } from 'react';

export default class SliderTrack extends Component {

  // static propTypes = {
  //   trackRef: PropTypes.func.isRequired,
  //   className: PropTypes.string,
  //   disabledClassName: PropTypes.string,
  //   style: PropTypes.object,
  //   disabledStyle: PropTypes.object,
  //   disabled: PropTypes.bool,
  //   orientation: PropTypes.string,
  // };

  // componentWillReceiveProps(properties: Object): void {
  //   if (properties.style !== this.props.style) {
  //     this.style = {
  //       ...(this.props.orientation === 'vertical' ? styles.trackVertical : styles.track),
  //       ...properties.style,
  //       ...(properties.disabled ?
  //         { ...styles.disabledTrack, ...properties.disabledStyle }
  //          : {}),
  //     };
  //   }
  // }

  // style: Object = {
  //   ...(this.props.orientation === 'vertical' ? styles.trackVertical : styles.track),
  //   ...this.props.style,
  //   ...(this.props.disabled ?
  //     { ...styles.disabledTrack, ...this.props.disabledStyle }
  //      : {}),
  // };

  render(): any {
    const { className, trackRef, disabledClassName, disabled } = this.props;
    console.log('CHALE');
    console.log((disabled && disabledClassName) ? disabledClassName : className);
    return (
      <div
        // ref={trackRef}
        disabled={disabled}
        className={'track'}
      >
        asd
      </div>
    );
  }
}
