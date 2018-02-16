// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Section from './section';
import { types } from '../../js/sections';

type param = string | number;
type Zone = {
  id: param,
  title: string,
  renderComponent: Function,
  type: $Keys<typeof types>,
}

export type StoreProps = {
  title: string,
  className?: string,
  topComponent?: React.Node,
  children?: React.Node,
  zones: Zone[],
  initialZone?: param,
};
export type Actions = {};

type Props = StoreProps & Actions;
type State = {
  zoneSelected?: param,
};
type Default = {
  className: string,
};

export default class TabbedSection extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    className: '',
  };

  state: State = {
    zoneSelected: undefined,
  };

  componentWillMount() {
    if (this.props.initialZone) {
      this.setState({ zoneSelected: this.props.initialZone });
    } else if (this.props.zones.length) {
      const [zone] = this.props.zones;
      if (zone) this.setState({ zoneSelected: zone.id });
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.initialZone && this.props.initialZone !== nextProps.initialZone) {
      this.setState({ zoneSelected: nextProps.initialZone });
    } else if (!this.props.zones.length && nextProps.zones.length) {
      const [zone] = nextProps.zones;
      if (zone) this.setState({ zoneSelected: zone.id });
    }
  }

  @autobind
  onZoneClick(id: string | number) {
    this.setState({ zoneSelected: id });
  }

  @autobind
  renderTabs() {
    const { zoneSelected } = this.state;
    const renderedZones = this.props.zones.map(z => (
      <div
        key={z.id}
        className={`tab ${z.id === zoneSelected ? 'selected' : ''}`}
        onClick={() => this.onZoneClick(z.id)}
        onKeyPress={() => this.onZoneClick(z.id)}
        role='menuitemradio'
        aria-checked={z.id === zoneSelected}
        tabIndex={0}
      >
        {z.title}
      </div>
    ));
    return renderedZones;
  }

  render() {
    const {
      className, children, title, topComponent, zones,
    } = this.props;
    const { zoneSelected } = this.state;

    let zoneToRender = zones.find(z => z.id === zoneSelected);
    zoneToRender = zoneToRender || {
      renderComponent: () => (<div />),
      type: 'none',
    };
    return (
      <Section
        className={`tabbed ${className || ''} ${zoneToRender.className || ''}`}
        title={title}
        topComponent={topComponent}
        middleComponent={this.renderTabs()}
        type={zoneToRender.type}
      >
        { zoneToRender.renderComponent() }
        { children }
      </Section>
    );
  }
}
