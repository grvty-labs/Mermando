// @flow
import * as React from 'react';

export type StoreProps = {
  className: string,

  burguerIcon: React.Node, // Icono de hamburguesa como componente de react
  imagotype: string, // Imagotipo del cliente
  anchors: Array<{ text: string, url: string }>, // Links que van hasta arriba
  avatar: string, // URL de donde se tiene que cargar el avatar
  username: string, // Nombre completo del usuario, pseudonimo o solo username
  notificationIcon: React.Node, // Icono de notificaciones como componente de react
};

export type Actions = {
  onBurguerClick: Function, // Función a ejecutar en cuanto se da clic en el icono de hamburguesa
  onAnchorClick: Function, // Función a ejecutar cuando se da clic en un link (puede ser push)
};

type Props = StoreProps & Actions;

/**
 * Componente responsable solamente de desplegar el topbar
 */
export default class Topbar extends React.Component<void, Props, void> {
  render() {
    const anchor = this.props.anchors.map((element, index) => (
      <div className='anchor' key={index} onClick={() => this.props.onAnchorClick(element.url)} role='link' tabIndex={0}>
        <span>{ element.text }</span>
      </div>
    ));

    return (
      <div className={this.props.className}>
        <div className='container'>
          <div className='column'>
            <div className='burger-container' onClick={() => { this.props.onBurguerClick(); }} role='button' tabIndex={0}>
              { this.props.burguerIcon }
            </div>
            <img className='imagotype' src={this.props.imagotype} alt='imagotype' />
            <div className='anchors'>
              { anchor }
            </div>
          </div>
          <div className='column column-avatar'>
            <div className='avatar' style={{ backgroundImage: `url( ${this.props.avatar} )` }} />
            <span>{ this.props.username }</span>
          </div>
        </div>
      </div>
    );
  }
}
