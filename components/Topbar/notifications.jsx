// @flow
import * as React from 'react';
import Button from '../Button';

export type StoreProps = {
  title?: string,
  icon?: React.Node, // Icono de notificaciones como componente de react
  anchors: Array<{ id: number, text: string, url: string }>,
  leftElement?: React.Node,
  rightElement?: React.Node,
}

export type Actions = {
  onAnchorClick: Function,
}

type Props = StoreProps & Actions;
type State = {};

export default class Notifications extends React.Component<Props, State> {
  render() {
    const {
      icon, anchors, title, onAnchorClick,
      leftElement, rightElement,
    } = this.props;

    return (
      <div className='menu-wrap'>
        <Button
          className='icon'
          type='link'
        >
          {icon}
        </Button>
        <div className='dropdown notifications'>
          <div className='title'>
            <div>{leftElement}</div>
            <div>{title}</div>
            <div>{rightElement}</div>
          </div>
          {anchors.map(anchor => (
            <Button
              key={anchor.id}
              type='link'
              onClick={() => onAnchorClick(anchor.url)}
            >
              {anchor.text}
            </Button>
          ))}
        </div>
      </div>
    );
  }
}
