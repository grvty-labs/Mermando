// @flow
import * as React from 'react';
import Card from './card';
import { ribbonColors } from '../globals';
import type { CardProps, Default as CardDefault } from './card';

export type RibbonedCardProps = {
  ribbonColor?: $Keys<typeof ribbonColors> | string,
} & CardProps;

type Default = {
  ribbonColor: $Keys<typeof ribbonColors> | string,
} & CardDefault;

/**
 * Componente responsable solamente de desplegar el sidebar
 */
export default class RibbonedCard extends React.Component<RibbonedCardProps, void> {
  static defaultProps: Default = {
    ribbonColor: 'brand',
    orientation: 'normal',
    type: 'small',
  };

  render() {
    const { ribbonColor, className, ...cardProps } = this.props;
    const safeRibbonColor = ribbonColor || 'brand';
    const isKnownRibbon = Object.prototype.hasOwnProperty.call(
      ribbonColors,
      safeRibbonColor.toLowerCase(),
    );
    return (
      <Card
        className={`${className || ''} ribbon ${isKnownRibbon ? safeRibbonColor : ''}`}
        style={isKnownRibbon ? {} : { borderColor: safeRibbonColor }}
        {...cardProps}
      >
        { this.props.children }
      </Card>
    );
  }
}
