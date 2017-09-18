// @flow
import * as React from 'react';

export type CardProps = {
  className: string,

  title: string, // Título de la tarjeta
  actions: React.Node, // Container(s) a desplegar

  children: React.Children | Array<React.Children>, // Contenido de la tarjeta
};

/**
 * Componente responsable solamente de desplegar el sidebar
 */
export default class Card extends React.Component<void, CardProps, void> {
  render() {
    return (
      <div>
        { this.props.children }
      </div>
    );
  }
}
