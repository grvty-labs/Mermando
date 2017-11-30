// @flow
import * as React from 'react';
import ButtonComponent from './Button';

type Props = {
  className?: string,
  children: React.Element<typeof ButtonComponent> | Array<React.Element<typeof ButtonComponent>>,
};

type Default = {
  className: string,
};

export default class Container extends React.PureComponent<Props, void> {
  static defaultProps: Default = {};

  render(): React.Element<*> {
    const { className, children } = this.props;
    return (
      <div className={`button-container ${className || ''}`}>
        {children}
      </div>
    );
  }
}
