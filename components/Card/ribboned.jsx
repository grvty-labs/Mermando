// @flow
import * as React from 'react';
import Card from './index';
import { ribbonColors } from '../globals';
import type { CardProps } from './index';

export type RibbonedCardProps = {
  ribbonColor: $Keys<typeof ribbonColors>,
} & CardProps;

/**
 * Componente responsable solamente de desplegar el sidebar
 */
export default class RibbonedCard extends React.Component<RibbonedCardProps, void> {
  render() {
    const { ribbonColor, className, ...cardProps } = this.props;
    return (
      <Card
        className={`${className || ''} ribbon ${ribbonColor}`}
        {...cardProps}
      >
        { this.props.children }
      </Card>
    );
  }
}
