// @flow
import * as React from 'react';
import Table from './pure';
import type { PureTableProps, PureTableActions } from './pure';

export type PaginatedTableProps = {
  // Container de react para manejar la paginación o el botón "More"
  paginationNode: React.Node,
} & PureTableProps;
export type PaginatedTableActions = {} & PureTableActions;

type Props = PaginatedTableProps & PaginatedTableActions;
/**
 * Componente responsable de desplegar una tabla con un sistema de paginación
 */
export default class PaginatedTable extends React.PureComponent<Props, void> {
  render() {
    const { paginationNode, ...pureTable } = this.props;
    return (
      <div className='paginated-table'>
        <Table {...pureTable} />
        { paginationNode }
      </div>
    );
  }
}
