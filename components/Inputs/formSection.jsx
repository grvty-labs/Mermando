// @flow
import * as React from 'react';

type Props = {
  className?: string,
  legend?: string,
  children: React.Node | Array<React.Node>,
};
type State = {};
type Default = {};


export default class FormSection extends React.PureComponent<Props, State> {
  static defaultProps: Default = {};

  render() {
    const { className, legend, children } = this.props;

    return (
      <div className={`form-section ${className || ''}`}>
        <span className='legend'>{legend}</span>
        {children}
      </div>
    );
  }
}
