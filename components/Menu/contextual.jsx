// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import classnames from 'classnames';
import Config from 'Config';
import { Button } from '../Button';

export type Props = {
  className?: string,
  icon?: React.Node | string,
  children: Array<React.Node>,
}

type State = {
  focus: boolean,
};
type Default = {
  className: string,
  icon: string,
};

export default class Notifications extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    className: '',
    icon: `${Config.mermando.icons.contextualButton}`,
  };

  state: State = {
    focus: false,
  }

  @autobind
  onClick() {
    this.setState({ focus: true });
    document.addEventListener('click', this.handleOutsideClick);
  }

  node: ?HTMLDivElement;

  @autobind
  handleOutsideClick(e: Event) {
    // ignore clicks on the component itself
    if (this.node && this.node.contains(e.target)) {
      return;
    }

    this.setState({ focus: false });
    document.removeEventListener('click', this.handleOutsideClick);
  }

  render() {
    const {
      className, icon, children,
    } = this.props;
    const { focus } = this.state;

    return (
      <div
        className={
          classnames('contextual-wrapper', { [`${className || ''}`]: true })
          }
        ref={(node) => { this.node = node; }}
      >
        <Button
          className={classnames({ focus })}
          strain='icon'
          icon={icon}
          onClick={this.onClick}
        />
        <div className='contextual'>
          {children}
        </div>
      </div>
    );
  }
}
