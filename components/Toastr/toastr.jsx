// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Config from 'Config';
import { colors } from '../../js/toastrs';

export type StoreProps = {
  color?: $Keys<typeof colors>,
  time: number,
  transitionsTime?: number,
  title?: string,
  legend: string,
  icon?: React.Node | string,

  className?: string,
};

export type Actions = {
  onCloseCallback: Function,
};

type Props = StoreProps & Actions;
type State = {
  show: boolean,
};
type Default = {
  color: $Keys<typeof colors>,
  transitionsTime: number,
  className: string,
};

export default class Toastr extends React.Component<Props, State> {
  static defaultProps: Default = {
    color: 'info',
    className: '',
    transitionsTime: 300,
  };
  state: State = {
    show: true,
  };

  componentDidMount() {
    const { transitionsTime, time, onCloseCallback } = this.props;
    const cleanTransTime = transitionsTime || 0;
    setTimeout(
      () => this.setState(
        { show: false },
        () => { setTimeout(onCloseCallback, cleanTransTime); },
      ),
      cleanTransTime + time,
    );
  }

  render() {
    const {
      className, color, icon, title, legend,
    } = this.props;
    const { show } = this.state;
    const iconRender = typeof icon === 'string'
      ? <span className={`icon ${Config.mermando.icons.classPrefix}${icon}`} />
      : icon;

    return (
      <div
        className={`toast  ${show ? '' : 'hide'} ${className || ''}`}
      >
        <div className={`ribbon ${color || ''}`} />
        <div className='content'>
          {iconRender}
          <div className='texts'>
            <span className='title'>{title}</span>
            <span className='legend'>{legend}</span>
          </div>
        </div>
      </div>
    );
  }
}
