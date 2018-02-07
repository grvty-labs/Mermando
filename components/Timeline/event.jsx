// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import classnames from 'classnames';
import { eventStatus } from '../../js/events';

export type Props = {
  className?: string,
  icon: string,
  title: string,
  status?: $Keys<typeof eventStatus>,
  date: string,
  eventType: number,
  eventName?: string,
  children?: React.Node,
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
  onClick(e: SyntheticEvent<*>) {
    const { onClick } = this.props;
    if (e) e.stopPropagation();
    if (onClick) onClick();
  }

  @autobind
  renderTitle() {
    const { title, onClick } = this.props;
    return (
      <span
        className='title'
        onClick={this.onClick}
        onKeyPress={this.onClick}
        tabIndex={onClick ? 0 : undefined}
        role={onClick ? 'menuitem' : undefined}
      >
        {title}
      </span>
    );
  }

  render() {
    const {
      className, icon, children, eventName = `ev${this.props.eventType}`,
      date, status, onClick,
    } = this.props;
    return (
      <div className={
        classnames('event', eventName, status, { clickable: onClick }, className)}
      >
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
