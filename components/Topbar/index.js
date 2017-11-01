// @flow
/* eslint no-console: [0, {}] */
import * as React from 'react';

export type StoreProps = {
  className: string,

  burgerIcon?: React.Node, // Icono de hamburguesa como componente de react
  imagotype: string, // Imagotipo del cliente
  anchors: Array<{ text: string, url: string }>, // Links que van hasta arriba
  avatar: string, // URL de donde se tiene que cargar el avatar
  username: string, // Nombre completo del usuario, pseudonimo o solo username
  notificationIcon?: React.Node, // Icono de notificaciones como componente de react
};

export type Actions = {
  onBurguerClick: Function, // Función a ejecutar en cuanto se da clic en el icono de hamburguesa
  onAnchorClick: Function, // Función a ejecutar cuando se da clic en un link (puede ser push)
};

type Props = StoreProps & Actions;

type Default = {
  burgerIcon: React.Node, // Icono de hamburguesa como componente de react
  notificationIcon: React.Node, // Icono de notificaciones como componente de react
};
/**
 * Componente responsable solamente de desplegar el topbar
 */
export default class Topbar extends React.Component<Default, Props, void> {
  static defaultProps = {
    burgerIcon: (
      <img
        // src='https://image.flaticon.com/icons/svg/462/462998.svg'
        src={require('../../assets/menu.svg')} // eslint-disable-line global-require
        alt='Burguer Icon'
      />
    ),
    notificationIcon: (
      <img
        src={require('../../assets/bell.svg')} // eslint-disable-line global-require
        // src='https://image.flaticon.com/icons/svg/462/462944.svg'
        alt='Notification Icon'
      />
    ),
  }

  render() {
    console.log(this.props.notificationIcon);
    const anchor = this.props.anchors.map((element, index) => (
      <div className='anchor' key={index} onClick={() => this.props.onAnchorClick(element.url)} role='link' tabIndex={0}>
        <span>{ element.text }</span>
      </div>
    ));

    return (
      <div className={this.props.className}>
        <div className='container'>
          <div className='column'>
            <div className='menu-container'>
              <div
                className='hamburger'
                onClick={() => { this.props.onBurguerClick(); }}
                role='button'
                tabIndex={0}
              >
                { this.props.burgerIcon }
              </div>
              <img
                className='imagotype'
                src={this.props.imagotype}
                alt='imagotype'
              />
            </div>
            <div className='anchors'>
              { anchor }
            </div>
          </div>
          {/* TODO: Notification */}
          <div className='column column-avatar'>
            <div
              className='avatar'
              style={{ backgroundImage: `url( ${this.props.avatar} )` }}
            />
            <span>{ this.props.username }</span>
          </div>
        </div>
      </div>
    );
  }
}
