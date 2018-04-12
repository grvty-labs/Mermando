// @flow
import * as React from 'react';

type Props = {
  className?: string,
  legend?: string,
  topComponent?: React.Node,
  children: React.Node,
  onSubmit?: Function,
};
type State = {};
type Default = {};


export default class FormSection extends React.PureComponent<Props, State> {
  static defaultProps: Default = {};

  render() {
    const {
      className, legend, children, topComponent,
    } = this.props;

    return (
      <form className={`form-section ${className || ''}`} onSubmit={this.props.onSubmit}>
        <div className='top'>
          {
            legend
              ? <span className='legend'>{legend}</span>
              : null
          }
          {topComponent}
        </div>
        {children}
      </form>
    );
  }
}
