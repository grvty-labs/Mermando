// @flow
import * as React from 'react';
import Avatar from './avatar';

import type { AvatarProps } from './avatar';

type AvatarsListProps = {
  avatars: Array<AvatarProps>,
  overlap?: boolean,
};

type Props = AvatarsListProps;
type Default = {
  overlap: boolean,
};
type State = {};

export default class AvatarsList extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    overlap: true,
  };

  render() {
    const { avatars, overlap } = this.props;
    return (
      <div className={`avatars-list ${overlap ? 'overlap' : ''}`}>
        { avatars.map((e, i) => (
          <Avatar key={i} hover='simple' {...e} />
        )) }
      </div>
    );
  }
}
