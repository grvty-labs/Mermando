// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import { eventStatus } from '../../js/events';

export type Props = {
  className?: string,
  icon: string,
  title: string,
  status?: $Keys<typeof eventStatus>,
  date: string,
  eventType: string | number,
  eventName?: string,
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
      className, icon, children, eventName = `ev${this.props.eventType}`, date, status,
    } = this.props;
    return (
      <div className={`event ${eventName || ''} ${status || ''} ${className || ''}`}>
        {/* FIXME: Remove path when connected to db */}
        <img src={icon} alt={eventName || ''} />
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
