// @flow
import * as React from 'react';
import { types } from '../../js/sections';

export type StoreProps = {
  title: string,
  className?: string,
  topComponent?: React.Node | Array<React.Node>,
  middleComponent?: React.Node | Array<React.Node>,
  children: React.Node | Array<React.Node>,
  type?: $Keys<typeof types>,
};
export type Actions = {};

type Props = StoreProps & Actions;
type State = {};
type Default = {
  className: string,
  type: $Keys<typeof types>,
};

export default class Section extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    className: '',
    type: 'none',
  };
  state: State = {};

  render() {
    const {
      className, children, title, middleComponent, topComponent, type,
    } = this.props;

    return (
      <div className={`section ${className || ''}`}>
        <div className='header'>
          <span className='title'>{title}</span>
          {topComponent}
        </div>
        <div className='middle'>
          {middleComponent}
        </div>
        <div className={`content ${type || ''}`}>
          {children}
        </div>
      </div>
    );
  }
}
