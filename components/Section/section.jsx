// @flow
import * as React from 'react';

export type StoreProps = {
  title: string,
  topComponent?: React.Node | Array<React.Node>,
  children: React.Node | Array<React.Node>,
  type?: 'cards-panel' | 'rows',
};

export type Actions = {
};

type Props = StoreProps & Actions;
type State = {};
type Default = {
  type: 'rows',
};

export default class Section extends React.Component<Props, State> {
  static defaultProps: Default = {
    type: 'rows',
  };
  // constructor(props: Props) {
  //   super(props);
  // }

  state: State = {};

  componentWillMount() {}
  componentDidMount() {}
  componentWillUnmount() {}

  render() {
    const {
      children, title, topComponent, type,
    } = this.props;

    return (
      <div className='section'>
        <div className='header'>
          <h3>{title}</h3>
          {topComponent}
        </div>
        <div className={type}>
          {children}
        </div>
      </div>
    );
  }
}
