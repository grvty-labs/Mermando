// @flow
import * as React from 'react';
import Card from './card';
import Ribboned from './ribboned';
import Tabbed from './tabbed';

type GenericCardElement =
  | React.Element<typeof Card>
  | React.Element<typeof Ribboned>
  | React.Element<typeof Tabbed>;

type Props = {
  title?: string,
  legend?: string,
  className?: string,
  type?: string,
  children: GenericCardElement | Array<GenericCardElement>,
};

type Default = {
  className: string,
  type: string,
};

export default class CardsList extends React.PureComponent<Props, void> {
  static defaultProps: Default = {
    className: '',
    type: 'squared',
  };

  render(): React.Element<*> {
    const {
      className, children, title, legend, type,
    } = this.props;
    return (
      <div className={`cards-list ${className || ''}`}>
        <span className='title'>{title}</span>
        <span className='legend'>{legend}</span>
        <div className={`grid ${type || ''}`}>
          {children}
        </div>
      </div>
    );
  }
}
