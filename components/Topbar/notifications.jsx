// @flow
import * as React from 'react';
import { Button } from '../Button';
import { Dropdown } from '../Menu';

export type StoreProps = {
  title?: string,
  icon?: React.Node, // Icono de notificaciones como componente de react
  anchors: Array<{
    id: number,
    title: string,
    text?: string,
    icon?: string,
    url: string,
    [key: string]: string,
  }>,
  leftElement?: React.Node,
  rightElement?: React.Node,
}

export type Actions = {
  onAnchorClick: Function,
}

type Props = StoreProps & Actions;
type State = {};

export default class Notifications extends React.PureComponent<Props, State> {
  render() {
    const {
      icon, anchors, title, onAnchorClick,
      leftElement, rightElement,
    } = this.props;

    return (
      <Dropdown
        className='notifications'
        icon={icon}
        buttonSize='huge'
        showHead
        headTitle={title}
        headLeftElement={leftElement}
        headRightElement={rightElement}
      >
        {anchors.map(anchor => (
          <Button
            key={anchor.id}
            strain={anchor.title || anchor.text ? 'link' : 'icon'}
            icon={anchor.icon}
            onClick={() => onAnchorClick(anchor.url)}
          >
            <b>{anchor.title}</b>
            <div dangerouslySetInnerHTML={{ __html: anchor.text }} />
          </Button>
        ))}
      </Dropdown>
    );
  }
}
