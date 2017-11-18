// @flow
import * as React from 'react';

type Props = {
  legend?: string,
  children: React.Node | Array<React.Node>,
};
type State = {};
type Default = {};


export default class FormSection extends React.PureComponent<Props, State> {
  static defaultProps: Default = {};

  render() {
    const { legend, children } = this.props;

    return (
      <div className='form-section'>
        <span className='legend'>{legend}</span>
        {children}
      </div>
    );
  }
}
