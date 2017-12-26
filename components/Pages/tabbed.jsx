// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Page from './page';

export type Zone = {
  id: string | number,
  mainTitle?: string,
  title: string,
  className?: string,
  statusClassName?: string,
  legend?: string,
  renderComponent: Function,
  topComponent?: React.Node | Array<React.Node>,
  renderTopComponent?: Function,
  type: 'separated-rows' | 'split' | 'none',
}

export type StoreProps = {
  title?: string,
  className?: string,
  backText?: string,
  topComponent?: React.Node | Array<React.Node>,
  children?: React.Node | Array<React.Node>,
  zones: Array<Zone>,
  hideTabs?: boolean,
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
  hideTabs: boolean,
};

export default class TabbedPage extends React.Component<Props, State> {
  static defaultProps: Default = {
    className: '',
    backText: 'go back',
    hideTabs: false,
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
    const { hideTabs } = this.props;
    if (!hideTabs) {
      const { zoneSelected } = this.state;
      const renderedZones = this.props.zones.map(z => (
        <div
          key={z.id}
          className={`tab ${z.id === zoneSelected ? 'selected' : ''} ${z.statusClassName || ''}`}
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
    return null;
  }

  render() {
    const {
      backText, className, title, topComponent,
      zones, children, onBackClick,
    } = this.props;
    const { zoneSelected } = this.state;

    let zoneRender = zones.find(z => z.id === zoneSelected);
    zoneRender = zoneRender || {
      renderComponent: () => (<div />),
      type: 'none',
    };
    return (
      <Page
        className={`tabbed ${className || ''} ${zoneRender.className || ''}`}
        title={zoneRender.mainTitle || title}
        topComponent={
          zoneRender.topComponent ||
          zoneRender.renderTopComponent
            ? zoneRender.renderTopComponent(this.onZoneClick)
            : topComponent
        }
        backText={backText}
        onBackClick={onBackClick}
        middleComponent={this.renderTabs()}
        legend={zoneRender.legend || ''}
        type={zoneRender.type}
      >
        { zoneRender.renderComponent(this.onZoneClick) }
        { children }
      </Page>
    );
  }
}
