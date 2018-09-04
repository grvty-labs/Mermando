// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import { getNamePastel } from '../../js/utils';

export type AvatarProps = {
  src?: string,
  alt?: string,
  srcSizes?: {
    src: string,
    width: number,
  }[],
};
type Props = {
  avatar?: AvatarProps,
  name?: string,
  hover?: 'simple' | 'complex' | 'none',
  onClick?: () => void,
};
type Default = {
  name: string,
  hover: 'simple' | 'complex' | 'none',
  onClick: undefined,
};

export default class Avatar extends React.PureComponent<Props, void> {
  static defaultProps: Default = {
    hover: 'none',
    name: 'Unknown',
  };

  @autobind
  getNameInitials(name: string): string {
    const matches = name.replace(/[^a-z- ]/ig, '').match(/\b\w/g);
    const initials = matches ? matches.join('') : '?';
    return initials.toUpperCase();
  }

  render() {
    const {
      avatar, name, hover, onClick,
    } = this.props;
    return (
      <div
        className='avatar'
        style={avatar && avatar.src
          ? { backgroundImage: `url(${avatar.src})` }
          : { backgroundColor: getNamePastel(name || '') }
        }
        aria-hidden={hover === 'none'}
        title={hover === 'simple' ? name : null}
        onClick={onClick || undefined}
        onKeyPress={onClick || undefined}
        role={onClick ? 'button' : null}
        tabIndex={onClick ? 0 : -1}
      >
        { avatar && avatar.src ? null : <span>{this.getNameInitials(name || '')}</span> }
      </div>
    );
  }
}
