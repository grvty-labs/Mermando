// @flow
import * as React from 'react';
import Card from './card';
import type { CardProps, Default as CardDefault } from './card';
import colours from '../../js/theme';

export type RibbonedCardProps = {
  ribbonColor?: $Keys<typeof colours> | string,
} & CardProps;

type Default = {
  ribbonColor: $Keys<typeof colours> | string,
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
      colours,
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
