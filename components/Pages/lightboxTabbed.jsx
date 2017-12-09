// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import { Button } from '../Button';
import Lightbox from './lightbox';

export type Zone = {
  title?: string,
  className?: string,
  renderComponent: Function,
}

export type StoreProps = {
  className?: string,
  show: boolean,
  title: string,
  lastBottomComponent?: React.Node | Array<React.Node>,
  zones: Array<Zone>,
};
export type Actions = {
  onCloseClick: Function,
  onToggleLightbox: Function,
};
type Props = StoreProps & Actions;
type State = {
  zoneSelected: number,
};
type Default = {
  className: string,
};

export default class LightboxTabbed extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    className: '',
  };
  state: State = {
    zoneSelected: 0,
  };

  @autobind
  onZoneClick(id: number) {
    this.setState({ zoneSelected: id });
  }

  @autobind
  renderBottomComponent() {
    const leftComponent = this.state.zoneSelected > 0
      ? (
        <Button
          size='small'
          type='discrete'
          onClick={() => this.onZoneClick(this.state.zoneSelected - 1)}
        >
          Previous
        </Button>)
      : <div />;

    const rightComponent = this.props.zones.length - 1 > this.state.zoneSelected
      ? (
        <Button
          size='small'
          type='main'
          onClick={() => this.onZoneClick(this.state.zoneSelected + 1)}
        >
          Next
        </Button>)
      : this.props.lastBottomComponent;
    return (
      <div className='footer'>
        {leftComponent}
        {rightComponent}
      </div>
    );
  }

  render() {
    const {
      className, onCloseClick, show, title,
      zones, onToggleLightbox,
    } = this.props;
    const { zoneSelected } = this.state;

    let zoneToRender = zones[zoneSelected];
    zoneToRender = zoneToRender || {
      renderComponent: () => (<div />),
    };

    return (
      <Lightbox
        className={`${className || ''} ${zoneToRender.className || ''}`}
        show={show}
        title={title}
        onCloseClick={onCloseClick}
        onToggleLightbox={onToggleLightbox}
      >
        <span>{zoneToRender.title}</span>
        { zoneToRender.renderComponent() }
        { this.renderBottomComponent() }
      </Lightbox>
    );
  }
}
