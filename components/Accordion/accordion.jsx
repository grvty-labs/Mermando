// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';

import { Button } from '../Button';

type Props = {
  buttonStrain?: string,
  displayPanel?: boolean,
  className?: string,
  title?: string,
  children?: React.Node | string,
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
  };
  state: State = {
    displayPanel: false,
  };

  componentWillMount() {
    const { displayPanel } = this.props;
    this.setState({
      displayPanel,
    });
  }

  render() {
    const {
      children, title, buttonStrain, className,
    } = this.props;
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
                });
              }}
            >
              {displayPanel ? 'Hide' : 'Show'}
            </Button>
          </div>
        </div>
        <div className='content'>
          <div className={`panel ${displayPanel ? 'active' : ''}`}>
            { children }
          </div>
        </div>
      </div>
    );
  }
}

