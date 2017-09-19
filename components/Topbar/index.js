// @flow
import * as React from 'react';

type Props = {
  className: string,

  burguerIcon: React.Node, // Icono de hamburguesa como componente de react
  imagotype: string, // Imagotipo del cliente
  anchors: Array<{ text: string, url: string }>, // Links que van hasta arriba
  avatar: string, // URL de donde se tiene que cargar el avatar
  username: string, // Nombre completo del usuario, pseudonimo o solo username
  notificationIcon: React.Node, // Icono de notificaciones como componente de react

  onBurguerClick: Function, // Función a ejecutar en cuanto se da clic en el icono de hamburguesa
  onAnchorClick: Function, // Función a ejecutar cuando se da clic en un link (puede ser push)
};

/**
 * Componente responsable solamente de desplegar el topbar
 */
export default class Topbar extends React.Component<void, Props, void> {
  render() {
    return (
      <div className={this.props.className}>
        <div className='container'>
          <div className='column'>
            <div className='hamburger' dangerouslySetInnerHTML={{ __html: this.props.burguerIcon }} />
            <img className='imagotype' src={this.props.imagotype} alt='imagotype' />
          </div>
          <div className='column'>
            <div className='avatar' style={{ backgroundImage: `url( ${this.props.avatar} )` }} />
            <span>{ this.props.username }</span>
          </div>
        </div>
      </div>
    );
  }
}
