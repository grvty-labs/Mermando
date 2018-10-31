// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import Avatar from './avatar';

import type { AvatarProps } from './avatar';

export type UserProps = {
  id: number | string,
  avatar?: AvatarProps,
  name: string,
  spec?: string,
  email: string,
  actions?: React.Node,
};

type StoreProps = {
  users?: UserProps[],
  className?: string,
  selected?: (number | string)[],
};

type Actions = {
  onElementClick?: () => void,
}

type Props = StoreProps & Actions;
type Default = {
  className: string,
};
type State = {};

export default class UsersList extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    className: '',
  };

  @autobind
  renderUserElement(user: UserProps) {
    const { selected, onElementClick } = this.props;
    return (
      <div
        key={user.id}
        className={classNames({ selected: selected && selected.includes(user.id) })}
        onClick={onElementClick ? () => onElementClick(user.id) : undefined}
        onKeyPress={onElementClick ? () => onElementClick(user.id) : undefined}
      >
        <Avatar {...user} />
        <div className='data'>
          <span className='name'>{user.name}</span>
          { Object.prototype.hasOwnProperty.call(user, 'spec') && user.spec
            ? <span className='spec'>{user.spec}</span>
            : null
          }
          { Object.prototype.hasOwnProperty.call(user, 'email') && user.email
            ? <span className='email'>{user.email}</span>
            : null
          }
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
      <div className={classNames('users-list', `${className}`)}>
        { users
          ? users.map(this.renderUserElement)
          : null
        }
      </div>
    );
  }
}
