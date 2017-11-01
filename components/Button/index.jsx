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

  children: React.Children | Array<React.Children>,
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
export default class Button extends React.Component<Default, Props, void> {
  static defaultProps = {
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
