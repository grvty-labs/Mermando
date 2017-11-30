// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import { Button } from '../Button';

export type StoreProps = {
  className?: string,
  title?: string,
  legend?: string,
  backText?: string,
  type?: string,
  topComponent?: React.Node | Array<React.Node>,
  middleComponent?: React.Node | Array<React.Node>,
  children: React.Node | Array<React.Node>,
  type?: 'separated-rows' | 'none',
};
export type Actions = {
  onBackClick: Function,
};

type Props = StoreProps & Actions;
type State = {
  close: boolean,
};
type Default = {
  className: string,
  type?: 'separated-rows' | 'none',
  backText: string,
};

export default class Page extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    className: '',
    type: 'separated-rows',
    backText: 'go back',
  };

  state: State = {
    close: false,
  };

  @autobind
  onBackClick() {
    const { onBackClick } = this.props;
    this.setState({ close: true }, () => setTimeout(onBackClick, 300));
  }

  render() {
    const {
      backText, className, children, legend, title, topComponent, type,
      middleComponent,
    } = this.props;
    const { close } = this.state;

    return (
      <div className={`page ${close ? 'close' : 'open'} ${className || ''}`}>
        <div className='top'>
          <Button type='link' onClick={this.onBackClick}>
            {backText}
          </Button>
        </div>
        <div className='header'>
          <h3>{title}</h3>
          {topComponent}
        </div>
        <div className='middle'>
          {middleComponent}
        </div>
        <div className={`content ${type || ''}`}>
          <span className='legend'>{legend}</span>
          {children}
        </div>
      </div>
    );
  }
}
