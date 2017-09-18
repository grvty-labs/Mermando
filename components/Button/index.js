// @flow
import * as React from 'react';

type Props = {
  className: string,

  text: string,
  size: 'small' | 'regular' | 'big' | 'huge',
  icon: React.Node,
};

/**
 * Componente responsable solamente de desplegar el sidebar
 */
export default class Button extends React.Component<void, Props, void> {
  render() {
    return (
      null
    );
  }
}
