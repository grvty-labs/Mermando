// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import classnames from 'classnames';
import { Button } from '../Button';

export type StoreProps = {
  className?: string,
  title?: string,
  legend?: string,
  backText?: string,
  topComponent?: React.Node | Array<React.Node>,
  middleComponent?: React.Node | Array<React.Node>,
  children: React.Node | Array<React.Node>,
  type?: 'separated-rows' | 'split' | 'none',
  hideSeparator?: boolean,
  progressValue?: number,
};
export type Actions = {
  onBackClick: Function,
};

type Props = StoreProps & Actions;
type State = {
  close: boolean,
  bannerHeight: number,
};
type Default = {
  className: string,
  type?: 'separated-rows' | 'split' | 'none',
  backText: string,
  progressValue: number,
  hideSeparator: boolean,
};

export default class Page extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    className: '',
    type: 'separated-rows',
    backText: 'go back',
    progressValue: 0,
    hideSeparator: false,
  };

  state: State = {
    close: false,
    bannerHeight: 150,
  };


  @autobind
  onBackClick() {
    const { onBackClick } = this.props;
    this.setState({ close: true }, () => setTimeout(onBackClick, 300));
  }

  bannerRef: ?HTMLDivElement;

  render() {
    const {
      backText, className, children, legend, title, topComponent, type,
      progressValue, middleComponent, hideSeparator, onBackClick
    } = this.props;
    const { bannerHeight, close } = this.state;

    return (
      <div className={classnames('page', { close, open: !close }, `${className || ''}`)}>
        <div className='banner' ref={(vref) => { if (vref) this.setState({ bannerHeight: vref.clientHeight }); }}>
          <div className='top'>
            {
              onBackClick
              ? <Button strain='link' onClick={this.onBackClick}>{backText}</Button>
              : null
            }
          </div>
          <div className='header'>
            {
              title
                ? <span className='title'>{title}</span>
                : null
            }
            {topComponent}
          </div>
          <div className='middle'>{middleComponent}</div>
          <div className={classnames('separator', { hide: hideSeparator })}>
            <div className={classnames('progress', { expand: progressValue })} style={{ width: `${progressValue || 0}%` }} />
          </div>
        </div>
        <div className='content-wrap'>
          <div className={`content ${type || ''}`} style={{ paddingTop: bannerHeight }}>
            {
              legend
                ? <span className='legend'>{legend}</span>
                : null
            }
            {children}
          </div>
        </div>
      </div>
    );
  }
}
