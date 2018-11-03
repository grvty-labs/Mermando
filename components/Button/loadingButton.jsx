// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Config from 'Config';
import classnames from 'classnames';

import { strains, types, sizes, linkColors } from '../../js/buttons';

export const STATUS = {
  LOADING: 'loading',
  DISABLED: 'disabled',
  SUCCESS: 'success',
  ERROR: 'error',
  NOTHING: '',
};

type Props = {
  className?: string,
  strain?: $Keys<typeof strains>,
  type?: $Keys<typeof types>,
  aria?: string,
  title?: string,

  size?: $Keys<typeof sizes>,
  icon?: React.Node | string,
  iconSide?: 'left' | 'right',
  linkColor?: $Keys<typeof linkColors>,
  disabled?: boolean,
  status: STATUS,
  onClick?: Function,

  children: any,

  durationSuccess?: number,
  durationError?: number,
  onSuccess?: () => void,
  onError?: () => void,
};

type Default = {
  className: string,
  strain: $Keys<typeof strains>,
  title: null,
  type: $Keys<typeof types>,
  size: $Keys<typeof sizes>,
  icon: null,
  iconSide: 'left' | 'right',
  linkColor: '',
  aria: string,

  onClick: Function,
  disabled: boolean,

  durationSuccess: number,
  durationError: number,
  onSuccess: null,
  onError: null,
}

type State = {
  currentState: STATUS,
};

/**
 * Componente responsable solamente de desplegar el sidebar
 */
export default class Button extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    className: '',
    type: 'button',
    strain: 'discrete',
    title: null,
    icon: null,
    linkColor: '',
    size: 'regular',
    iconSide: 'left',
    aria: '',
    currentState: STATUS.NOTHING,

    onClick: () => { },
    disabled: false,
    durationSuccess: 3000,
    durationError: 5000,
    onSuccess: null,
    onError: null,
  };

  state = {
    currentState: STATUS.NOTHING,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status === this.props.status) return;
    switch (nextProps.status) {
      case STATUS.SUCCESS:
        this.success();
        break;
      case STATUS.ERROR:
        this.error();
        break;
      case STATUS.LOADING:
        this.loading();
        break;
      case STATUS.DISABLED:
        this.disable();
        break;
      case STATUS.NOTHING:
        this.notLoading();
        break;
      default:
        break;
    }
  }

  @autobind
  onClick(event: SyntheticEvent<*>) {
    event.stopPropagation();
    if (this.props.onClick &&
      this.state.currentState !== STATUS.LOADING &&
      this.state.currentState !== STATUS.DISABLED
    ) {
      this.loading();
      const ret = this.props.onClick(event);
      this.handlePromise(ret);
    }
  }

  @autobind
  handlePromise(promise: Promise) {
    if (promise && promise.then && promise.catch) {
      console.log('PROMISE');
      promise.then((data) => {
        this.success(null, true, data);
      }).catch((err) => {
        this.error(null, err);
      });
    }
  }

  btn: ?HTMLButtonElement;
  timeoutID: ?number;
  // circle: ?SVGElement;
  // checkmark: ?SVGElement;
  // cross: ?SVGElement;


  @autobind
  loading() {
    this.setState({ currentState: STATUS.LOADING });
  }

  @autobind
  notLoading() {
    this.setState({ currentState: STATUS.NOTHING });
  }

  @autobind
  enable() {
    this.setState({ currentState: STATUS.NOTHING });
  }

  @autobind
  disable() {
    this.setState({ currentState: STATUS.DISABLED });
  }

  @autobind
  success(callback, dontRemove, data) {
    this.setState({ currentState: STATUS.SUCCESS });
    this.timeoutID = setTimeout(() => {
      if (!dontRemove) this.setState({ currentState: STATUS.NOTHING });
      const callbackFunc = callback || this.props.onSuccess;
      if (typeof callbackFunc === 'function') callbackFunc(data);
    }, this.props.durationSuccess);
  }

  @autobind
  error(callback, err) {
    this.setState({ currentState: STATUS.ERROR });
    this.timeoutID = setTimeout(() => {
      this.setState({ currentState: STATUS.NOTHING });
      const callbackFunc = callback || this.props.onError;
      if (typeof callbackFunc === 'function') callbackFunc(err);
    }, this.props.durationError);
  }

  render() {
    const {
      aria, className, type, size, icon, iconSide, disabled,
      linkColor, children, strain, title,
    } = this.props;
    const { currentState } = this.state;

    const iconRender = typeof icon === 'string'
      ? <span className={`${Config.mermando.icons.classPrefix}${icon}`} />
      : icon;

    return (
      <div className={classnames('progress-button', [`${currentState}`])}>
        <button
          ref={(vref) => { this.btn = vref; }}
          onClick={this.onClick}
          type={type || ''}
          disabled={disabled || currentState === STATUS.DISABLED}
          className={
            `button ${strain || ''} ${size || ''} ${
            iconRender && strain !== 'icon' ? 'iconned' : ''} ${
            iconSide === 'right' ? 'inverted' : ''} ${className || ''} ${
            strain === 'link' ? linkColor || '' : ''}`
          }
          aria-label={aria || null}
          aria-hidden={children && strain !== 'icon'}
          title={title}
        >
          <span>
            {iconRender}
            {strain !== 'icon' ? children : null}
          </span>
          <div className='progress-border' />
          <svg className='progress-circle' viewBox='0 0 41 41'>
            <path d='M38,20.5 C38,30.1685093 30.1685093,38 20.5,38' />
          </svg>
          <svg className='checkmark' viewBox='0 0 70 70'>
            <path d='m31.5,46.5l15.3,-23.2' />
            <path d='m31.5,46.5l-8.5,-7.1' />
          </svg>
          <svg className='cross' viewBox='0 0 70 70'>
            <path d='m35,35l-9.3,-9.3' />
            <path d='m35,35l9.3,9.3' />
            <path d='m35,35l-9.3,9.3' />
            <path d='m35,35l9.3,-9.3' />
          </svg>
        </button>
      </div>
    );
  }
}
