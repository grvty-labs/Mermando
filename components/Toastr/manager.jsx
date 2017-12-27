// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Toast from './toast';
import type { StoreProps as ToastProps } from './toast';

export type ToastType = {
  id: number | string,
} & ToastProps

export type StoreProps = {
  toasts: Array<ToastType>,
  clickToCloseToasts?: boolean,
  time?: number,
};
export type Actions = {
  onToastsClose: Function,
};

type Props = StoreProps & Actions;
type State = {};
type Default = {
  time: number,
  clickToCloseToasts: boolean,
};

export default class ToastrManager extends React.Component<Props, State> {
  static defaultProps: Default = {
    time: 5000,
    clickToCloseToasts: false,
  };
  state: State = {};

  @autobind
  renderToast(toast: ToastType) {
    const { clickToCloseToasts, time, onToastsClose } = this.props;
    return (
      <Toast
        key={toast.id}
        color={toast.color}
        title={toast.title}
        time={toast.time || time}
        legend={toast.legend}
        clickToClose={toast.clickToClose || clickToCloseToasts || false}
        onCloseCallback={() => onToastsClose(toast.id)}
      />
    );
  }

  render() {
    const { toasts } = this.props;
    return (
      <div className='toast-manager'>
        { toasts.map(this.renderToast) }
      </div>
    );
  }
}
