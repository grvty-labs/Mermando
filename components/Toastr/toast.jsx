// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Config from 'Config';
import { colors } from '../../js/toastrs';

export type StoreProps = {
  color?: $Keys<typeof colors>,
  time?: number,
  clickToClose?: boolean,
  transitionsTime?: number,
  title: string,
  legend?: React.Node | string,
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
  clickToClose: boolean,
};

export default class Toast extends React.Component<Props, State> {
  static defaultProps: Default = {
    color: 'info',
    className: '',
    time: 5000,
    transitionsTime: 400,
    clickToClose: false,
  };
  state: State = {
    show: true,
  };

  componentDidMount() {
    const {
      transitionsTime, time, clickToClose,
    } = this.props;

    if (!clickToClose) {
      const cleanTransTime = transitionsTime || 0;
      this.timer = setTimeout(this.close, cleanTransTime + time);
    }
  }

  timer: number;

  @autobind
  close() {
    if (this.timer) clearTimeout(this.timer);
    if (this.state.show) {
      const {
        transitionsTime, onCloseCallback,
      } = this.props;
      const cleanTransTime = transitionsTime || 0;
      this.setState(
        { show: false },
        () => { setTimeout(onCloseCallback, cleanTransTime); },
      );
    }
  }

  render() {
    const {
      className, color, icon, title, legend,
      clickToClose,
    } = this.props;
    const { show } = this.state;
    const iconRender = typeof icon === 'string'
      ? <span className={`icon ${Config.mermando.icons.classPrefix}${icon}`} />
      : icon;

    return (
      <div className='toast-placeholder'>
        <div
          className={`toast ${show ? '' : 'hide'} ${className || ''}`}
          onClick={this.close}
          onKeyPress={this.close}
          tabIndex={clickToClose ? 1 : -1}
          role='button'
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
      </div>
    );
  }
}
