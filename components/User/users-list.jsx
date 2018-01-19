// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Avatar from './avatar';

type User = {
  id: number | string,
  email: string,
  name: string,
  avatarUrl?: string,
  actions?: React.Node | Array<React.Node>,
}

type StoreProps = {
  users: Array<User>,
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
        <Avatar url={user.avatarUrl} email={user.email} name={user.name} />
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
