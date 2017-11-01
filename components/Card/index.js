// @flow
import * as React from 'react';

export type CardProps = {
  className?: string,

  title?: string, // Título de la tarjeta
  actions?: React.Node | Array<React.Node>, // Container(s) a desplegar

  footer?: React.Node | Array<React.Node>, // Container(s) a desplegar

  children: React.Children | Array<React.Children>, // Contenido de la tarjeta
};

/**
 * Componente responsable solamente de desplegar el sidebar
 */
export default class Card extends React.Component<void, CardProps, void> {
  render() {
    const { className, title, actions, footer } = this.props;
    return (
      <div className={`card ${className || ''}`}>
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
