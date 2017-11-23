// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import { hashCode, intToRGB } from '../../js/utils';

export type AvatarProps = {
  url?: string,
  name?: string,
  hover?: 'simple' | 'complex' | 'none',
};
type Props = AvatarProps;
type Default = {
  hover: 'simple' | 'complex' | 'none',
};

export default class Avatar extends React.Component<Props, void> {
  static defaultProps: Default = {
    hover: 'none',
  };

  @autobind
  getNameColor(name: string): string {
    return `#${intToRGB(hashCode(name))}`;
  }

  @autobind
  getNameInitials(name: string): string {
    const matches = name.replace(/[^a-z- ]/ig, '').match(/\b\w/g);
    const initials = matches ? matches.join('') : '?';
    return initials.toUpperCase();
  }

  render() {
    const { url, name, hover } = this.props;
    return (
      <div
        className='avatar'
        style={url
          ? { backgroundImage: `url(${url})` }
          : { backgroundColor: this.getNameColor(name || 'Unknown') }
        }
        aria-hidden={hover === 'none'}
        title={hover === 'simple' ? name : null}
      >
        { url ? null : <span>{this.getNameInitials(name || 'Unknown')}</span> }
      </div>
    );
  }
}
