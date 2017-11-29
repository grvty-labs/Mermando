// @flow
/* eslint react/no-unused-prop-types: [0] */
/* eslint consistent-return: [0] */
import * as React from 'react';
import { CheckboxInput } from '../Inputs';
import { Contextual } from '../Menu';
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
};

export type PureTableActions = {
  // Posible acción a ejecutar en caso de que den clic en el header
  onHeaderClick?: Function,
  // Posible función para manejar en un reducer la selección de items
  onSelect?: Function,
  // Posible lista de acciones disponibles en el botón de hotdog de cada item
  onSingleItemActions?: SingleItemActions,
  // Posible lista de acciones disponibles para la selección de múltiples items
  onMultipleItemsActions?: MultipleItemsActions,
};

type Props = PureTableProps & PureTableActions;

type Default = {
  selectable: boolean,
  className: string,
};

type State = {
  // Que hotdog se encuentra abierto
  itemHotdogActive: number,
  selected: { [key: string]: boolean },
};

/**
 * Componente responsable solamente de desplegar la tabla de datos
 */
export default class Table extends React.Component<Props, State> {
  static defaultProps: Default = {
    selectable: false,
    className: 'pure-table',
  };

  constructor(props: Props) {
    super(props);
    (this: any).toggleItemHotdog = this.toggleItemHotdog.bind(this);
    (this: any).renderActions = this.renderActions.bind(this);
    (this: any).renderHeader = this.renderHeader.bind(this);
    (this: any).renderItem = this.renderItem.bind(this);
    (this: any).rowCheckClick = this.rowCheckClick.bind(this);
  }

  state: State = {
    itemHotdogActive: -1,
    selected: {},
  };

  toggleItemHotdog(itemIndex: number) {
    this.setState({
      itemHotdogActive: itemIndex !== this.state.itemHotdogActive
        ? itemIndex
        : -1,
    });
  }

  rowCheckClick(id: string, value: boolean) {
    const { selected } = this.state;
    selected[id] = value;
    this.setState({ selected });
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
            disabled={!action.available}
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
    const { onSingleItemActions } = this.props;
    const { headers, selectable } = this.props;
    const { selected } = this.state;
    const key = `checkbox-${index}`;
    return (
      <tr key={index}>
        { !selectable
          ? null
          : (
            <td>
              <CheckboxInput
                id={key}
                value={Object.prototype.hasOwnProperty.call(selected, key) && selected[key]}
                onChange={(value: boolean) => { this.rowCheckClick(key, value); }}
              />
            </td>)
        }
        { headers.map((header, ind) => (
          <td key={ind}>
            <span>{element[header.key]}</span>
          </td>))
        }
        { onSingleItemActions
          ? (
            <td>
              <Contextual>
                { this.renderActions(element.id, element.actions)}
              </Contextual>
            </td>
          )
          : null
        }
      </tr>
    );
  }

  render() {
    const {
      headers, items, className, selectable, onSingleItemActions,
    } = this.props;

    const headersRender = headers.map(this.renderHeader);
    const itemsRender = items.map(this.renderItem);

    return (
      <table
        className={
          `${className || ''} ${selectable ? 'multiselect' : ''} ${onSingleItemActions ? 'contextual-actions' : ''}`
        }
      >
        <thead>
          <tr>
            { !selectable ? null : <th />}
            { headersRender }
            { onSingleItemActions
              ? <th />
              : null
            }
          </tr>
        </thead>
        <tbody>
          { itemsRender }
        </tbody>
      </table>
    );
  }
}
