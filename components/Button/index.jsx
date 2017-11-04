// @flow
import * as React from 'react';

type Props = {
  className?: string,
  type?: 'main' | 'secondary' | 'discrete' | 'link',

  size?: 'small' | 'regular' | 'big' | 'huge',
  icon?: React.Node,
  iconSide?: 'left' | 'right',
  disabled?: boolean,

  onClick?: Function,

  children: React.Node | Array<React.Node>,
};

type Default = {
  className: string,
  type: 'main' | 'secondary' | 'discrete' | 'link',
  size: 'small' | 'regular' | 'big' | 'huge',
  iconSide: 'left' | 'right',

  onClick: Function,
  disabled: boolean,
}

/**
 * Componente responsable solamente de desplegar el sidebar
 */
export default class Button extends React.Component<Props, void> {
  static defaultProps: Default = {
    className: '',
    type: 'discrete',
    size: 'regular',
    iconSide: 'left',

    onClick: () => {},
    disabled: false,
  };

  render() {
    const {
      className, type, size, icon, iconSide, disabled, onClick, children,
    } = this.props;
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={
          `${type || ''} ${size || ''} ${icon ? 'iconned' : ''} ${iconSide === 'right' ? 'invert' : ''} ${className || ''}`
        }
      >
        {icon}
        {children}
      </button>
    );
  }
}
