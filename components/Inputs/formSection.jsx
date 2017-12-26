// @flow
import * as React from 'react';

type Props = {
  className?: string,
  legend?: string,
  topComponent?: React.Node | Array<React.Node>,
  children: React.Node | Array<React.Node>,
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
      <div className={`form-section ${className || ''}`}>
        <div className='top'>
          {
            legend
              ? <span className='legend'>{legend}</span>
              : null
          }
          {topComponent}
        </div>
        {children}
      </div>
    );
  }
}
