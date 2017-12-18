// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Config from 'Config';
import { types, sizes, linkColors } from '../../js/buttons';

type Props = {
  className?: string,
  type?: $Keys<typeof types>,
  aria?: string,

  size?: $Keys<typeof sizes>,
  icon?: React.Node | string,
  iconSide?: 'left' | 'right',
  linkColor?: $Keys<typeof linkColors>,
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

  @autobind
  onClick(event: SyntheticEvent<*>) {
    event.stopPropagation();
    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  render() {
    const {
      aria, className, type, size, icon, iconSide, disabled, linkColor,
      children,
    } = this.props;

    const iconRender = typeof icon === 'string'
      ? <span className={`${Config.mermando.icons.classPrefix}${icon}`} />
      : icon;

    return (
      <button
        onClick={this.onClick}
        disabled={disabled}
        className={
          `button ${type || ''} ${size || ''} ${
            iconRender && type !== 'icon' ? 'iconned' : ''} ${
            iconSide === 'right' ? 'inverted' : ''} ${className || ''} ${
            type === 'link' ? linkColor || '' : ''}`
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
