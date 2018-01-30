// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Avatar from './avatar';

import type { AvatarProps } from './avatar';

type User = AvatarProps & {
  id: number | string,
  email: string,
  actions?: React.Node | React.Node[],
}

type StoreProps = {
  users: User[],
  className?: string,
};

type Actions = {}

type Props = StoreProps & Actions;
type Default = {
  className: string,
};
type State = {};

export default class AvatarsList extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    className: '',
    overlap: true,
  };

  @autobind
  renderUserElement(user: User) {
    return (
      <div key={user.id}>
        <Avatar {...user} />
        <div className='data'>
          <span className='name'>{user.name}</span>
          <span className='email'>{user.email}</span>
        </div>
        <div className='actions'>
          {user.actions}
        </div>
      </div>
    );
  }

  render() {
    const { users, className } = this.props;
    return (
      <div className={`users-list ${className || ''}`}>
        { users
          ? users.map(this.renderUserElement)
          : []}
      </div>
    );
  }
}
