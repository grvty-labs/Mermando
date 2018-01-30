// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import { getNamePastel } from '../../js/utils';

export type AvatarProps = {
  avatar?: {
    src: string,
    alt?: string,
    srcSizes?: {
      src: string,
      width: number,
    }[],
  },
  name?: string,
  hover?: 'simple' | 'complex' | 'none',
};
type Props = AvatarProps;
type Default = {
  hover: 'simple' | 'complex' | 'none',
};

export default class Avatar extends React.PureComponent<Props, void> {
  static defaultProps: Default = {
    hover: 'none',
  };

  @autobind
  getNameInitials(name: string): string {
    const matches = name.replace(/[^a-z- ]/ig, '').match(/\b\w/g);
    const initials = matches ? matches.join('') : '?';
    return initials.toUpperCase();
  }

  render() {
    const { avatar, name, hover } = this.props;
    return (
      <div
        className='avatar'
        style={avatar
          ? { backgroundImage: `url(${avatar.src})` }
          : { backgroundColor: getNamePastel(name || 'Unknown') }
        }
        aria-hidden={hover === 'none'}
        title={hover === 'simple' ? name : null}
      >
        { avatar ? null : <span>{this.getNameInitials(name || 'Unknown')}</span> }
      </div>
    );
  }
}
