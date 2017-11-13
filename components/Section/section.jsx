// @flow
import * as React from 'react';

export type StoreProps = {
  title: string,
  className?: string,
  topComponent?: React.Node | Array<React.Node>,
  children: React.Node | Array<React.Node>,
  type?: 'cards-panel' | 'none' | 'separated-rows',
};
export type Actions = {};

type Props = StoreProps & Actions;
type State = {};
type Default = {
  className: string,
  type: 'cards-panel' | 'none' | 'separated-rows',
};

export default class Section extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    className: '',
    type: 'none',
  };
  // constructor(props: Props) {
  //   super(props);
  // }

  state: State = {};

  render() {
    const {
      className, children, title, topComponent, type,
    } = this.props;

    return (
      <div className={`section ${className || ''}`}>
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
