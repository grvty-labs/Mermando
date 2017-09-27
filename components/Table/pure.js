// @flow
/* eslint react/no-unused-prop-types: [0] */
/* eslint consistent-return: [0] */
import * as React from 'react';
import type { Header, Item, SingleItemActions, MultipleItemsActions } from './types';

export type PureTableProps = {
  className: string,

  // Los encabezados de la tabla, es decir, lo que va en th
  headers: Array<Header>,
  // Los objetos a desplegar en la tabla
  items: Array<Item>,
  // Posible componente de react para mostrar el botón de hotdog que va en cada row
  hotdogIcon?: React.Node,
  // Puedes seleccionar 1 o más elementos de la tabla
  selectable: boolean,

  // Posible acción a ejecutar en caso de que den clic en el header
  onHeaderClick?: Function,
  // Posible función para manejar en un reducer la selección de items
  onSelect?: Function,
  // Posible lista de acciones disponibles en el botón de hotdog de cada item
  onSingleItemActions?: SingleItemActions,
  // Posible lista de acciones disponibles para selección de múltiples items
  onMultipleItemsActions?: MultipleItemsActions,
};

type Default = {
  selectable: boolean,
};

type State = {
  // Que hotdog se encuentra abierto
  itemHotdogActive: number,
};

/**
 * Componente responsable solamente de desplegar la tabla de datos
 */
export default class PureTable extends React.Component<Default, PureTableProps, State> {
  static defaultProps: Default = {
    selectable: false,
  };

  constructor(props: PureTableProps) {
    super(props);
    (this: any).toggleItemHotdog = this.toggleItemHotdog.bind(this);
    (this: any).renderActions = this.renderActions.bind(this);
  }

  state: State = {
    itemHotdogActive: -1,
  };

  toggleItemHotdog(itemIndex: number) {
    this.setState({
      itemHotdogActive: itemIndex !== this.state.itemHotdogActive
        ? itemIndex
        : -1,
    });
  }

  renderActions(element: Item | null) {
    // console.log(element);
    if (element) {
      const actions = element.map((el, index) => (
        <div key={index}>
          { el.available ? el.key : null }
        </div>
      ));
      return actions;
    }
  }

  render() {
    const header = this.props.headers.map((element, index) => (
      <th key={index}>{ element.Header.text }</th>
    ));

    const item = this.props.items.map((element, index) => (
      <tr key={index}>
        { element.Item.titles.map((el, id) => (
          <td key={id}>
            {id === 0 ? <img className='checkbox' src='assets/checkbox-off.svg' alt='checkbox' /> : null }
            <span>{ el.text }</span>
          </td>
        ))}
        <td>
          { this.renderActions(element.Item.actions)}
        </td>
      </tr>
    ));

    return (
      <div className={this.props.className}>
        <div className='title-container'>
          {/* <h3>{ this.props.Header }</h3> */}
          <div className='title'>
            <h3>Table Card</h3>
          </div>
          <div className='button-container'>
            <div className='secondary-button' role='button'>
              Secondary
            </div>
            <div className='primary-button' role='button'>
              Primary Action
            </div>
          </div>
        </div>
        <div className='container'>
          <table>
            <thead>
              <tr>
                { header }
                <th />
              </tr>
            </thead>
            <tbody>
              { item }
            </tbody>
          </table>
        </div>
        <div className='button-container'>
          <div className='more-button'>
            More
          </div>
        </div>
      </div>
    );
  }
}
