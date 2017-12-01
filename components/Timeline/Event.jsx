// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import moment from 'moment';

import { eventStatus } from '../../js/events';

export type Props = {
  className?: string,
  icon: string,
  title: string,
  status?: $Keys<typeof eventStatus>,
  date: moment,
  eventType: string,
  children?: React.Node | Array<React.Node>,
  onClick?: Function,
};

type Default = {
  className: string,
  status: $Keys<typeof eventStatus>,
};

export default class Event extends React.PureComponent<Props, void> {
  static defaultProps: Default = {
    className: '',
    status: 'pending',
  };

  @autobind
  renderTitle() {
    const { title, onClick } = this.props;
    if (onClick) {
      return (
        <span
          className='title'
          onClick={onClick}
          onKeyPress={onClick}
          tabIndex={0}
          role='menuitem'
        >
          {title}
        </span>
      );
    }
    return <span className='title'>{title}</span>;
  }

  render() {
    const {
      className, icon, children, eventType, date, status,
    } = this.props;
    return (
      <div className={`event ${eventType} ${status || ''} ${className || ''}`}>
        <div className='header'>
          {/* FIXME: Remove path when connected to db */}
          <img src={`/images/svg/${icon}.svg`} alt={eventType} />
          {this.renderTitle()}
          <span className='date'>{date.fromNow()}</span>
        </div>
        <div className='content'>
          {children}
        </div>
      </div>
    );
  }
}
