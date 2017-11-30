// @flow
/* eslint no-console: [0, {}] */
import * as React from 'react';
import { Button } from '../Button';
import { Avatar } from '../User';
import { Dropdown } from '../Menu';

export type StoreProps = {
  className: string,

  burgerIcon?: React.Node, // Icono de hamburguesa como componente de react
  imagotype: string, // Imagotipo del cliente
  anchors: Array<{ text: string, url: string }>, // Links que van hasta arriba
  avatar?: string, // URL de donde se tiene que cargar el avatar
  username: string, // Nombre completo del usuario, pseudonimo o solo username
  profileAnchors: Array<{ id: number, text: string, url: string }>,

  notificationsComponent?: React.Node,
};

export type Actions = {
  onBurguerClick: Function, // Función a ejecutar en cuanto se da clic en el icono de hamburguesa
  onAnchorClick: Function, // Función a ejecutar cuando se da clic en un link (puede ser push)
};

type Props = StoreProps & Actions;

type Default = {
};
/**
 * Componente responsable solamente de desplegar el topbar
 */
export default class Topbar extends React.PureComponent<Props, void> {
  static defaultProps: Default = {
    notifications: false,
  }

  render() {
    const {
      anchors, burgerIcon, className, imagotype,
      avatar, username, profileAnchors, notificationsComponent,
      onBurguerClick, onAnchorClick,
    } = this.props;

    const centralAnchors = anchors.map((element, index) => (
      <div
        className='anchor'
        key={index}
        onClick={() => onAnchorClick(element.url)}
        onKeyPress={() => onAnchorClick(element.url)}
        role='link'
        tabIndex={0}
      >
        <span>{element.text}</span>
      </div>
    ));

    return (
      <div className={className}>
        <div className='container'>
          <div className='column'>
            <div className='menu-container'>
              {burgerIcon
                ? (
                  <div
                    className='icon'
                    onClick={() => { onBurguerClick(); }}
                    onKeyPress={() => { onBurguerClick(); }}
                    role='button'
                    tabIndex={0}
                  >
                    {burgerIcon}
                  </div>
                )
                : null
              }
              { imagotype
                ? (
                  <img
                    className='imagotype'
                    src={imagotype}
                    alt='imagotype'
                  />
                )
                : null
              }
            </div>
            <div className='anchors'>
              {centralAnchors}
            </div>
          </div>

          <div className='column right'>
            {notificationsComponent}

            <Avatar url={avatar} name={username} />
            <Dropdown
              className='user-options'
              buttonSize='small'
              text={username}
              showAngle
            >
              {profileAnchors.map(anchor => (
                <Button key={anchor.id} type='link'>
                  {anchor.text}
                </Button>
              ))}
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }
}
