// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Config from 'Config';
import { strains, types, sizes, linkColors } from '../../js/buttons';

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

  onClick?: Function,

  children?: React.Node | Array<React.Node>,
};

type Default = {
  className: string,
  strain: $Keys<typeof strains>,
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
    type: 'button',
    strain: 'discrete',
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
      children, strain, title,
    } = this.props;

    const iconRender = typeof icon === 'string'
      ? <span className={`${Config.mermando.icons.classPrefix}${icon}`} />
      : icon;

    return (
      <button
        onClick={this.onClick}
        type={type || ''}
        disabled={disabled}
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
        {iconRender}
        {strain !== 'icon' ? children : null}
      </button>
    );
  }
}
