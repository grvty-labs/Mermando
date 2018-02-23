// @flow
/* eslint no-console: [0, {}] */
import * as React from 'react';
import autobind from 'autobind-decorator';
import { Button } from '../Button';
import { Avatar } from '../User';
import { Dropdown } from '../Menu';

import type { AvatarProps } from '../User';

export type StoreProps = {
  className: string,

  burgerIcon?: React.Node, // Icono de hamburguesa como componente de react
  imagotype: string, // Imagotipo del cliente
  anchors: {
    id: number | string,
    text: string,
    url?: string,
    path?: string,
    actionKey?: string,
  }[], // Links que van hasta arriba
  avatar?: AvatarProps,
  username: string, // Nombre completo del usuario, pseudonimo o solo username
  profileAnchors: {
    id: number | string,
    text: string,
    url?: string,
    path?: string,
    actionKey?: string,
  }[],

  contactComponent?: React.Node,
  notificationsComponent?: React.Node,
};

export type Actions = {
  onBurguerClick: Function, // Función a ejecutar en cuanto se da clic en el icono de hamburguesa
  onAnchorClick: Function, // Función a ejecutar cuando se da clic en un link (puede ser push)
  [key: string]: Function,
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

  @autobind
  onClick(url?: string, path?: string, actionKey?: string) {
    const { onAnchorClick } = this.props;
    if (path) {
      onAnchorClick(path);
    } else if (actionKey && Object.prototype.hasOwnProperty.call(this.props, actionKey)) {
      this.props[actionKey]();
    } else if (url) {
      window.location = url;
    }
  }

  render() {
    const {
      anchors, burgerIcon, className, imagotype,
      contactComponent, avatar, username, profileAnchors,
      notificationsComponent, onBurguerClick,
    } = this.props;

    const centralAnchors = anchors.map(element => (
      <div
        className='anchor'
        key={element.id}
        onClick={() => this.onClick(element.url, element.path, element.actionKey)}
        onKeyPress={() => this.onClick(element.url, element.path, element.actionKey)}
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
            {contactComponent}
            {notificationsComponent}

            <Avatar avatar={avatar} name={username} />
            <Dropdown
              className='user-options'
              buttonSize='small'
              text={username}
            >
              {profileAnchors.map(anchor => (
                <Button
                  key={anchor.id}
                  strain='link'
                  onClick={() => this.onClick(anchor.url, anchor.path, anchor.actionKey)}
                  className={anchor.selected ? 'focus' : ''}
                >
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
