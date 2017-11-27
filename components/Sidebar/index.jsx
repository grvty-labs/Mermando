// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';

export type AnchorType = {
  text: string,
  url: string,
  icon: string,
  exact: boolean,
  active?: boolean,
};

export type StoreProps = {
  className?: string,
  show: boolean, // Debería de mostrarse?
  closeIcon?: React.Node, // Icono de hamburguesa como componente de react
  imagotype: string, // Imagotipo del cliente
  anchors: Array<AnchorType>, // Links que van hasta arriba
  location?: {
    pathname: string,
  },
};

export type Actions = {
  onCloseClick: Function, // Función a ejecutar en cuanto se da clic en el icono de hamburguesa
  onAnchorClick: Function, // Función a ejecutar cuando se da clic en un link (puede ser push)
  renderAnchor?: Function,
};

type Props = StoreProps & Actions;
type State = {};
type Default = {
  closeIcon: React.Node, // Icono de hamburguesa como componente de react
  renderAnchor: Function,
};

/**
 * Componente responsable solamente de desplegar el sidebar
 */
export default class Sidebar extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    closeIcon: (
      <img
        src='https://image.flaticon.com/icons/svg/463/463065.svg'
        alt='Close Icon'
      />
    ),

    renderAnchor: (element: AnchorType, index: number) => (
      <div
        className='anchor'
        key={index}
        onClick={() => this.onAnchorClick(element.url)}
        onKeyPress={() => this.onAnchorClick(element.url)}
        role='link'
        tabIndex={0}
      >
        <span>{element.text}</span>
      </div>
    ),
  }

  @autobind
  onAnchorClick(element: AnchorType): void {
    this.props.onAnchorClick(element.url);
  }

  @autobind
  isActive(element: AnchorType, location: { pathname: string }): boolean {
    return (element.exact && location.pathname === `/${element.url}`)
      || (!element.exact && location.pathname.startsWith(`/${element.url}`));
  }

  render() {
    const {
      anchors,
      className,
      imagotype,
      location,
      onCloseClick,
      renderAnchor,
      show,
    } = this.props;
    const anchorsRender = anchors.map((e, i) => renderAnchor({
      ...e,
      active: this.isActive(e, location),
    }, i));

    return (
      <div className={`${className || ''} ${show ? ' show' : ' hidden'}`}>
        <div className='head'>
          <div
            className='close-container'
            onClick={() => { onCloseClick(); }}
            onKeyPress={() => { onCloseClick(); }}
            role='button' tabIndex={0}
          >
            { this.props.closeIcon }
          </div>
          <img className='imagotype' src={imagotype} alt='Imagotype' />
        </div>
        <div className='body'>
          {anchorsRender}
        </div>
      </div>
    );
  }
}
