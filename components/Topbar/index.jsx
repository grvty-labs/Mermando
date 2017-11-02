// @flow
/* eslint no-console: [0, {}] */
import * as React from 'react';
import Button from '../Button';

export type StoreProps = {
  className: string,

  burgerIcon?: React.Node, // Icono de hamburguesa como componente de react
  imagotype: string, // Imagotipo del cliente
  anchors: Array<{ text: string, url: string }>, // Links que van hasta arriba
  avatar: string, // URL de donde se tiene que cargar el avatar
  username: string, // Nombre completo del usuario, pseudonimo o solo username
  profileAnchors: Array<{ text: string, url: string }>,
  notificationIcon?: React.Node, // Icono de notificaciones como componente de react
  notificationAnchors: Array<{ text: string, url: string }>,
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
        src={'/images/mermando/menu.svg'}
        alt='Burguer Icon'
      />
    ),
    notificationIcon: (
      <img
        src={'/images/mermando/bell.svg'}
        // src='https://image.flaticon.com/icons/svg/462/462944.svg'
        alt='Notification Icon'
      />
    ),
  }

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
            <div className='menu-container'>
              <div
                className='icon'
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

          <div className='column right'>
            <div className='menu-wrap'>
              <a
                href='javascript:void(0)'
                className='icon'
                role='button'
                tabIndex={0}
              >
                { this.props.notificationIcon }
              </a>
              <div className='dropdown'>
                { this.props.notificationAnchors.map(anchor => (
                  <Button key={anchor.id} type='link'>
                    {anchor.text}
                  </Button>
                )) }
              </div>
            </div>

            <div
              className='avatar'
              style={{ backgroundImage: `url( ${this.props.avatar} )` }}
            />
            <div className='menu-wrap'>
              <a href='javascript:void(0)' className='angled'>
                { this.props.username }
              </a>
              <div className='dropdown'>
                { this.props.profileAnchors.map(anchor => (
                  <Button key={anchor.id} type='link'>
                    {anchor.text}
                  </Button>
                )) }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
