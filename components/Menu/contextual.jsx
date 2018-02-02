// @flow
import * as React from 'react';
import Config from 'Config';
import { Button } from '../Button';

export type Props = {
  className?: string,
  icon?: React.Node | string,
  children: Array<React.Node>,
}

type State = {};
type Default = {
  className: string,
  icon: string,
};

export default class Notifications extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    className: '',
    icon: `${Config.mermando.icons.contextualButton}`,
  };

  render() {
    const {
      className, icon, children,
    } = this.props;

    return (
      <div className={`contextual-wrapper ${className || ''}`}>
        <Button
          strain='icon'
          icon={icon}
        />
        <div className='contextual'>
          {children}
        </div>
      </div>
    );
  }
}
