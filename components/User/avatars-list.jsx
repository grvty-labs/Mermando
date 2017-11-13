// @flow
import * as React from 'react';
import Avatar from './avatar';

import type { AvatarProps } from './avatar';

type AvatarsListProps = {
  avatars: Array<AvatarProps>,
};

type Props = AvatarsListProps;
type State = {};

export default class AvatarsList extends React.Component<Props, State> {
  render() {
    const { avatars } = this.props;
    return (
      <div className='avatars-list'>
        { avatars.map((e, i) => (
          <Avatar key={i} hover='simple' {...e} />
        )) }
      </div>
    );
  }
}
