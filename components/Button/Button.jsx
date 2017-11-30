// @flow
import * as React from 'react';
import { types, sizes } from '../../js/buttons';

type Props = {
  className?: string,
  type?: $Keys<typeof types>,
  aria?: string,

  size?: $Keys<typeof sizes>,
  icon?: React.Node | string,
  iconSide?: 'left' | 'right',
  disabled?: boolean,

  onClick?: Function,

  children?: React.Node | Array<React.Node>,
};

type Default = {
  className: string,
  type: $Keys<typeof types>,
  size: $Keys<typeof sizes>,
  iconSide: 'left' | 'right',
  aria: string,

  onClick: Function,
  disabled: boolean,
}

/**
 * Componente responsable solamente de desplegar el sidebar
 */
export default class Button extends React.PureComponent<Props, void> {
  static defaultProps: Default = {
    className: '',
    type: 'discrete',
    size: 'regular',
    iconSide: 'left',
    aria: '',

    onClick: () => {},
    disabled: false,
  };

  render() {
    const {
      aria, className, type, size, icon, iconSide, disabled,
      onClick, children,
    } = this.props;

    const iconRender = typeof icon === 'string'
      ? <span className={`symbolicon ${icon}`} />
      : icon;

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={
          `button ${type || ''} ${size || ''} ${iconRender && type !== 'icon' ? 'iconned' : ''} ${iconSide === 'right' ? 'inverted' : ''} ${className || ''}`
        }
        aria-label={aria || null}
        aria-hidden={children && type !== 'icon'}
      >
        {iconRender}
        {type !== 'icon' ? children : null}
      </button>
    );
  }
}
