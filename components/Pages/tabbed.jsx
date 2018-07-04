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
  renderComponent: (changeZone?: Function) => void,
  renderTopComponent?: (changeZone?: Function) => void,
}

export type StoreProps = {
  title?: string,
  className?: string,
  backText?: string,
  topComponent?: React.Node | Array<React.Node>,
  children?: React.Node | Array<React.Node>,
  zones: Zone[],
  hideTabs?: boolean,
  initialZone?: number | string,
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
  changeZone(id: string | number) {
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
          onClick={() => this.changeZone(z.id)}
          onKeyPress={() => this.changeZone(z.id)}
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
            ? zoneRender.renderTopComponent(this.changeZone)
            : topComponent
        }
        backText={backText}
        onBackClick={onBackClick}
        middleComponent={this.renderTabs()}
        legend={zoneRender.legend || ''}
        type={zoneRender.type}
      >
        { zoneRender.renderComponent(this.changeZone) }
        { children }
      </Page>
    );
  }
}
