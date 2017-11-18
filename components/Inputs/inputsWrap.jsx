// @flow
import * as React from 'react';

type Props = {
  legend?: string,
  children: React.Node | Array<React.Node>,
  type?: 'column' | 'inline' | 'grid-row' | 'grid-col',
  rowsNumber?: number,
};
type State = {};
type Default = {
  type: 'column' | 'inline' | 'grid-row' | 'grid-col',
  rowsNumber: number,
};

export default class InputsWrap extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    type: 'column',
    rowsNumber: 3,
  };

  render() {
    const {
      legend, children, rowsNumber, type,
    } = this.props;
    const style = type === 'grid-row'
      ? { gridTemplateRows: `repeat(${rowsNumber || 3}, min-content)` }
      : type === 'grid-col'
        ? { gridTemplateColumns: `repeat(${rowsNumber || 3}, minmax(70px, min-content))` }
        : {};

    return (
      <div className='inputs-wrap'>
        <span className='legend'>{legend}</span>
        <div className={type || ''} style={style}>
          {children}
        </div>
      </div>
    );
  }
}
