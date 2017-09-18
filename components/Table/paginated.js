// @flow
import * as React from 'react';
import PureTable from './pure';
import type { PureTableProps } from './pure';

export type PaginatedTableProps = {
  // Container de react para manejar la paginación o el botón "More"
  paginationNode: React.Node,
} & PureTableProps;

/**
 * Componente responsable de desplegar una tabla con un sistema de paginación
 */
export default class PaginatedTable extends React.Component<void, PaginatedTableProps, void> {
  render() {
    const { paginationNode, ...pureTable } = this.props;
    return (
      <div>
        <PureTable {...pureTable} />
        { paginationNode }
      </div>
    );
  }
}
