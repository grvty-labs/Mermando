// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import { Button, ButtonContainer } from '../Button';
import Lightbox from './lightbox';

export type Zone = {
  title?: string,
  className?: string,
  canBack?: boolean,
  canContinue?: boolean,
  renderComponent: Function,
}

export type StoreProps = {
  className?: string,
  show: boolean,
  resetOnOpen?: boolean,
  title: string,
  lastBottomComponent?: React.Element<typeof Button>,
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
  resetOnOpen: boolean,
};

export default class LightboxTabbed extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    className: '',
    resetOnOpen: false,
  };
  state: State = {
    zoneSelected: 0,
  };

  componenWillMount() {
    if (this.props.resetOnOpen) {
      this.setState({
        zoneSelected: 0,
      });
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.resetOnOpen && this.props.show !== nextProps.show) {
      this.setState({
        zoneSelected: 0,
      });
    }
  }

  @autobind
  onZoneClick(id: number) {
    this.setState({ zoneSelected: id });
  }

  @autobind
  renderBottomComponent() {
    const zone = this.props.zones[this.state.zoneSelected];
    const leftComponent = this.state.zoneSelected > 0
      ? (
        <Button
          size='small'
          strain='link'
          disabled={zone.canBack === false}
          onClick={() => this.onZoneClick(this.state.zoneSelected - 1)}
        >
          Previous
        </Button>)
      : undefined;

    const rightComponent = this.props.zones.length - 1 > this.state.zoneSelected
      ? (
        <Button
          size='small'
          strain='main'
          disabled={zone.canContinue === false}
          onClick={() => this.onZoneClick(this.state.zoneSelected + 1)}
        >
          Next
        </Button>)
      : this.props.lastBottomComponent;
    return (
      <ButtonContainer>
        {leftComponent}
        {rightComponent}
      </ButtonContainer>
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
        footerComponent={this.renderBottomComponent()}
      >
        <span>{zoneToRender.title}</span>
        { zoneToRender.renderComponent() }
      </Lightbox>
    );
  }
}
