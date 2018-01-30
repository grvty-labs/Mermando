// @flow
import * as React from 'react';
import Avatar from './avatar';

import type { AvatarProps } from './avatar';

type AvatarsListProps = {
  avatars?: AvatarProps[],
  className?: string,
  overlap?: boolean,
};

type Props = AvatarsListProps;
type Default = {
  avatars: AvatarProps[],
  className: string,
  overlap: boolean,
};
type State = {};

export default class AvatarsList extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    avatars: [],
    className: '',
    overlap: true,
  };

  render() {
    const { avatars, className, overlap } = this.props;
    return (
      <div className={`avatars-list ${overlap ? 'overlap' : ''} ${className || ''}`}>
        { avatars
          ? avatars.map((e: AvatarProps, i: number) => (
            <Avatar key={i} hover='simple' {...e} />
          ))
          : [] }
      </div>
    );
  }
}
