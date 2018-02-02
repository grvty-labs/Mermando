// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Config from 'Config';
import Page from './page';

export type Zone = {
  id: string | number,
  className?: string,
  legend?: string,
  icon?: string,
  iconTitle?: string,
  mainTitle?: string,
  statusClassName?: string,
  title: string,
  topComponent?: React.Node | Array<React.Node>,
  type: 'separated-rows' | 'split' | 'none',
  renderComponent: Function,
  renderTopComponent?: Function,
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
    const { classPrefix } = Config.mermando.icons;
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
          <span>{z.title}</span>
          {
            z.icon
              ? <span className={`tabIcon ${classPrefix}${z.icon}`} title={z.iconTitle} />
              : null
          }
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
