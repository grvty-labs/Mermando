// @flow
import * as React from 'react';

export type CardProps = {
  className?: string,
  type?: 'small' | 'medium' | 'large';

  title?: string, // Título de la tarjeta
  actions?: React.Node | Array<React.Node>, // Container(s) a desplegar

  footer?: React.Node | Array<React.Node>, // Container(s) a desplegar

  children: React.Node | Array<React.Node>, // Contenido de la tarjeta
};

type Default = {
  type: 'small';
}

/**
 * Componente responsable solamente de desplegar el sidebar
 */
export default class Card extends React.Component<CardProps, void> {
  static defaultProps: Default = {
    type: 'small',
  };

  render() {
    const {
      className, title, actions, footer, type,
    } = this.props;
    return (
      <div className={`card ${type || ''} ${className || ''}`}>
        <div className='header'>
          <h5>{title}</h5>
          { actions }
        </div>
        <div className='content'>
          { this.props.children }
        </div>
        <div className='footer'>{footer}</div>
      </div>
    );
  }
}
