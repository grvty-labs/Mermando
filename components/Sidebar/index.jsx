// @flow
import * as React from 'react';

type Props = {
  className: string,
  show: boolean, // Debería de mostrarse?
  closeIcon?: React.Node, // Icono de hamburguesa como componente de react
  imagotype: string, // Imagotipo del cliente
  anchors: Array<{ text: string, url: string }>, // Links que van hasta arriba

  onCloseClick: Function, // Función a ejecutar en cuanto se da clic en el icono de hamburguesa
  onAnchorClick: Function, // Función a ejecutar cuando se da clic en un link (puede ser push)
  renderAnchor?: Function,
};

type Default = {
  closeIcon: React.Node, // Icono de hamburguesa como componente de react
  renderAnchor: Function,
};

/**
 * Componente responsable solamente de desplegar el sidebar
 */
export default class Sidebar extends React.Component<Props, void> {
  static defaultProps: Default = {
    closeIcon: (
      <img
        src='https://image.flaticon.com/icons/svg/463/463065.svg'
        alt='Close Icon'
      />
    ),
    renderAnchor: (element, index) => (
      <div
        className='anchor'
        key={index}
        onClick={() => this.props.onAnchorClick(element.url)}
        onKeyPress={() => this.props.onAnchorClick(element.url)}
        role='link'
        tabIndex={0}
      >
        <span>{element.text}</span>
      </div>
    ),
  }

  render() {
    const anchor = this.props.anchors.map(this.props.renderAnchor);

    return (
      <div className={this.props.className + (this.props.show ? ' show' : ' hidden')}>
        <div className='head'>
          <div
            className='close-container'
            onClick={() => { this.props.onCloseClick(); }}
            onKeyPress={() => { this.props.onCloseClick(); }}
            role='button' tabIndex={0}
          >
            { this.props.closeIcon }
          </div>
          <img className='imagotype' src={this.props.imagotype} alt='Imagotype' />
        </div>
        <div className='body'>
          {anchor}
        </div>
      </div>
    );
  }
}
