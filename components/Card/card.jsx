// @flow
import * as React from 'react';
import Config from 'Config';

export type CardProps = {
  className?: string,
  style?: { [key: string]: any },
  size?: 'small' | 'medium' | 'large',
  orientation?: 'normal' | 'centered',

  title?: string, // Título de la tarjeta
  icon?: string,
  actions?: React.Node | Array<React.Node>, // Container(s) a desplegar

  footer?: React.Node | Array<React.Node>, // Container(s) a desplegar

  children: React.Node | Array<React.Node>, // Contenido de la tarjeta
  onClick?: Function,
};

export type Default = {
  orientation: 'normal' | 'centered';
  size: 'small' | 'medium' | 'large';
}

/**
 * Componente responsable solamente de desplegar el sidebar
 */
export default class Card extends React.PureComponent<CardProps, void> {
  static defaultProps: Default = {
    orientation: 'normal',
    size: 'small',
  };

  render() {
    const {
      className, title, actions, footer, orientation, style,
      size, onClick, icon,
    } = this.props;
    return (
      <div
        className={`card ${size || ''} ${orientation || ''}  ${onClick ? 'hasAction' : ''} ${className || ''}`}
        style={style}
        onClick={onClick}
        onKeyPress={onClick}
        role={onClick ? 'menuitem' : undefined}
        tabIndex={onClick ? 0 : -1}
      >
        <div className='header'>
          {title ? <span className='title'>{title}</span> : null}
          {actions}
        </div>
        <div className='content'>
          { icon ? <span className={`icon ${Config.mermando.icons.classPrefix}${icon}`} /> : null}
          { this.props.children }
        </div>
        <div className='footer'>{footer}</div>
      </div>
    );
  }
}
