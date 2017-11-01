// @flow
import * as React from 'react';
import Card from './index';
import { colors } from '../globals';
import type { CardProps } from './index';

export type RibbonedCardProps = {
  ribbon: $Keys<typeof colors>,
} & CardProps;

/**
 * Componente responsable solamente de desplegar el sidebar
 */
export default class RibbonedCard extends React.Component<void, RibbonedCardProps, void> {
  render() {
    const { ribbon, className, ...cardProps } = this.props;
    return (
      <Card
        className={`${className} ribbon ${ribbon}`}
        {...cardProps}
      />
    );
  }
}
