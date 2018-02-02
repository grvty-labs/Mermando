// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import moment from 'moment';

import { EventDictionary } from '../../../Overrides/EventConstants';
import { eventStatus } from '../../js/events';

export type Props = {
  className?: string,
  icon: string,
  title: string,
  status?: $Keys<typeof eventStatus>,
  date: string,
  eventType: number,
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
      <div className={`event ${EventDictionary.find(event => (event.key === eventType), eventType).name} ${status || ''} ${className || ''}`}>
        {/* FIXME: Remove path when connected to db */}
        <img src={icon} alt={EventDictionary.find(event => (event.key === eventType), eventType).name} />
        <div className='data'>
          <div className='header'>
            {this.renderTitle()}
            <span className='date'>{date}</span>
          </div>
          <div className='content'>
            {children}
          </div>
        </div>
      </div>
    );
  }
}
