// @flow
/* eslint react/no-unused-prop-types: [0] */
/* eslint consistent-return: [0] */
import * as React from 'react';
import Card from '../Card';
import Button from '../Button';
import type {
  Header, Item, SingleItemActions, MultipleItemsActions,
  ItemAvailableAction,
} from './types';

export type PureTableProps = {
  className?: string,

  // Los encabezados de la tabla, es decir, lo que va en th
  headers: Array<Header>,
  // Los objetos a desplegar en la tabla
  items: Array<Item>,
  // Posible componente de react para mostrar el botón de hotdog que va en cada row
  hotdogIcon?: React.Node,
  // Puedes seleccionar 1 o más elementos de la tabla
  selectable: boolean,

  singleItemActionIcon?: React.Node,

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
  className: string,
  singleItemActionIcon: React.Node,
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
    className: 'pure-table',
    singleItemActionIcon: (
      <img
        src={require('../../assets/hotdog.svg')} // eslint-disable-line global-require
        // src='https://image.flaticon.com/icons/svg/462/462988.svg'
        alt='Notification Icon'
      />
    ),
  };

  constructor(props: PureTableProps) {
    super(props);
    (this: any).toggleItemHotdog = this.toggleItemHotdog.bind(this);
    (this: any).renderActions = this.renderActions.bind(this);
    (this: any).renderHeader = this.renderHeader.bind(this);
    (this: any).renderItem = this.renderItem.bind(this);
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

  renderActions(id: number | string, actions: Array<ItemAvailableAction>) {
    const { onSingleItemActions } = this.props;
    const actionsRender = actions.map((action, index) => {
      if (onSingleItemActions &&
        Object.prototype.hasOwnProperty.call(onSingleItemActions, action.key)
      ) {
        const ActionObj = onSingleItemActions[action.key];
        return (
          <ActionObj.Component
            key={index}
            {...ActionObj.componentProps}
            disabled={action.available}
            onClick={() => ActionObj.func(id)}
          />
        );
      }
      return null;
    });
    return actionsRender;
  }

  renderHeader(element: Header) {
    return (
      <th key={element.key}>{ element.text }</th>
    );
  }

  renderItem(element: Item, index: number) {
    const { headers, selectable, singleItemActionIcon } = this.props;
    return (
      <tr key={index}>
        { !selectable
          ? null
          : <td>
            <div className='checkbox' >
              <input type='checkbox' id={`checkbox-${index}`} />
              <label htmlFor={`checkbox-${index}`} />
            </div>
            {/* <img className='checkbox' src='assets/checkbox-off.svg' alt='checkbox' /> */}
          </td>
        }
        { headers.map((header, ind) => (
          <td key={ind}>
            <span>{ element[header.key] }</span>
          </td>))
        }
        <td>
          <Button type='link'>
            { singleItemActionIcon }
          </Button>
          <div className='pop'>
            { this.renderActions(element.id, element.actions)}
          </div>
        </td>
      </tr>
    );
  }

  render() {
    const { headers, items, className, selectable, onSingleItemActions } = this.props;

    const headersRender = headers.map(this.renderHeader);
    const itemsRender = items.map(this.renderItem);

    return (
      <Card
        className={className}
        title='Table Card'
        actions={
          <div className='button-container'>
            <Button>Discrete</Button>
            <Button type='main'>Main Action</Button>
          </div>
        }
        footer={
          <Button type='secondary'>Secondary</Button>
        }
      >
        <table
          className={
            `${selectable ? 'multiselect' : ''} ${onSingleItemActions ? 'actionpop' : ''}`
          }
        >
          <thead>
            <tr>
              { !selectable ? null : <th />}
              { headersRender }
              <th />
            </tr>
          </thead>
          <tbody>
            { itemsRender }
          </tbody>
        </table>
      </Card>
    );
  }
}
