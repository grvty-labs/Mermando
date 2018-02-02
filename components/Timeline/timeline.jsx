// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Event from './event';

export type Props = {
  className?: string,
  children: React.Element<typeof Event> | Array<React.Element<typeof Event>>,
};

type Default = {
  className: string,
};

export default class Timeline extends React.PureComponent<Props, void> {
  static defaultProps: Default = {
    className: '',
  };

  render() {
    const {
      children, className,
    } = this.props;
    return (
      <div className={`timeline ${className || ''}`}>
        {children}
      </div>
    );
  }
}
