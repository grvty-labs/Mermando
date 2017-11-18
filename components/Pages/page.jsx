// @flow
import * as React from 'react';

export type StoreProps = {
  title: string,
  backComponent: React.Node,
  className?: string,
  type?: string,
  topComponent?: React.Node | Array<React.Node>,
  children: React.Node | Array<React.Node>,
};
export type Actions = {};

type Props = StoreProps & Actions;
type State = {};
type Default = {
  className: string,
  type: string,
};

export default class Page extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    className: '',
    type: '',
  };

  state: State = {};

  render() {
    const {
      backComponent, className, children, title, topComponent, type,
    } = this.props;

    return (
      <div className={`page ${className || ''}`}>
        <div className='top'>
          {backComponent}
        </div>
        <div className='header'>
          <h3>{title}</h3>
          {topComponent}
        </div>
        <div className={`content ${type || ''}`}>
          {children}
        </div>
      </div>
    );
  }
}
