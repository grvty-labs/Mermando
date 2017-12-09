// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Section from './section';

type Zone = {
  id: string | number,
  title: string,
  renderComponent: Function,
  type: 'cards-panel' | 'none' | 'separated-rows',
}

export type StoreProps = {
  title: string,
  className?: string,
  topComponent?: React.Node | Array<React.Node>,
  children?: React.Node | Array<React.Node>,
  zones: Array<Zone>,
};
export type Actions = {};

type Props = StoreProps & Actions;
type State = {
  zoneSelected?: string | number,
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
    if (this.props.zones.length > 0) {
      this.setState({ zoneSelected: this.props.zones[0].id });
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
        className={`tabbed ${className || ''}`}
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
