// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';

import { Button } from '../Button';

type Props = {
  id?: number | string,
  buttonStrain?: string,
  displayPanel?: boolean,
  className?: string,
  title?: string,
  children?: React.Node | string,

  onDisplayPanel?: Function,
};

type State = {
  displayPanel: boolean,
};

type Default = {
  buttonStrain: string,
  displayPanel: boolean,
}

export default class Accordion extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    buttonStrain: 'link',
    displayPanel: false,
    onDisplayPanel: () => {},
  };
  state: State = {
    displayPanel: false,
  };

  componentWillMount() {
    const { displayPanel } = this.props;
    const callback = () => this.setState({ displayPanel });
    if (displayPanel) {
      setTimeout(callback, 100);
    } else {
      callback();
    }
  }

  render() {
    const {
      children, title, buttonStrain, className, id,
      onDisplayPanel
    } = this.props;
    const elementId = id || 'panel';
    const panelHeight = document.getElementById(elementId)
      ? document.getElementById(elementId).scrollHeight
      : 1000;
    const { displayPanel } = this.state;
    return (
      <div className={`accordion ${className || ''}`}>
        <div className='header'>
          <div className='title'>
            {title}
          </div>
          <div className='action'>
            <Button
              strain={buttonStrain}
              onClick={() => {
                this.setState({
                  displayPanel: !this.state.displayPanel,
                }, () => {
                  onDisplayPanel(this.state.displayPanel);
                });
              }}
            >
              {displayPanel ? 'Hide' : 'Show'}
            </Button>
          </div>
        </div>
        <div className='content'>
          <div
            id={id || 'panel'}
            className={`panel ${displayPanel ? 'active' : ''}`}
            style={displayPanel ? { minHeight: `${panelHeight}px` } : { minHeight: '0px' }}
          >
            { children }
          </div>
        </div>
      </div>
    );
  }
}

