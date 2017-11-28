// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Page from './page';

type Zone = {
  id: string | number,
  title: string,
  className?: string,
  legend?: string,
  renderComponent: Function,
  type: 'separated-rows' | 'none',
}

export type StoreProps = {
  title: string,
  className?: string,
  backText?: string,
  topComponent?: React.Node | Array<React.Node>,
  zones: Array<Zone>,
};

export type Actions = {
  onBackClick: Function,
};

type Props = StoreProps & Actions;
type State = {
  zoneSelected?: string | number,
};
type Default = {
  className: string,
  backText: string,
};

export default class TabbedPage extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    className: '',
    backText: 'go back',
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
      backText, className, title, topComponent, zones, onBackClick,
    } = this.props;
    const { zoneSelected } = this.state;

    let zoneToRender = zones.find(z => z.id === zoneSelected);
    zoneToRender = zoneToRender || {
      renderComponent: () => (<div />),
      type: 'none',
    };
    return (
      <Page
        className={`tabbed ${className || ''} ${zoneToRender.className || ''}`}
        title={title}
        topComponent={topComponent}
        backText={backText}
        onBackClick={onBackClick}
        middleComponent={this.renderTabs()}
        legend={zoneToRender.legend || ''}
        type={zoneToRender.type}
      >
        { zoneToRender.renderComponent() }
      </Page>
    );
  }
}
