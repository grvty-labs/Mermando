// @flow
import * as React from 'react';
import Config from 'Config';
import autobind from 'autobind-decorator';
import { breakpoints } from '../../js/images';

export type Size = {
  src: string,
  width: number, // The src image size (px)
};

export type Viewport = {
  breakpoint: $Keys<typeof breakpoints>,
  width: string, // The element size on the viewport when rendered. (px, vw, calc, etc).
};

export type StoreProps = {
  className?: string,
  alt?: string,
  src: string,
  srcSizes?: Size[],
  viewports?: Viewport[],
};
export type Actions = {
  onClick?: Function;
};
type Props = StoreProps & Actions;

type Default = {};
type State = {};

export default class FluidImage extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    className: 'fluid-img',
  };
  state: State = {};

  @autobind
  generateSourceSets() {
    const { srcSizes } = this.props;
    let sourceSet = '';
    if (srcSizes) {
      srcSizes.forEach((size) => {
        const newSource = `${size.src} ${size.width}w`;
        sourceSet = `${sourceSet}${sourceSet ? `, ${newSource}` : newSource}`;
      });
    }
    return sourceSet;
  }

  @autobind
  generateSizes() {
    const { viewports } = this.props;
    let sizeSet = '';
    if (viewports) {
      viewports.forEach((viewport) => {
        const newSize = `${Config.mermando.breakpoints[viewport.breakpoint]} ${viewport.width}`;
        sizeSet = `${sizeSet}${sizeSet ? `, ${newSize}` : newSize}`;
      });
    }
    return sizeSet;
  }

  render() {
    const { className } = this.props;
    return (
      <img
        className={className || ''}
        srcSet={this.generateSourceSets()}
        sizes={this.generateSizes()}
        src={this.props.src}
        alt={this.props.alt}
        onClick={this.props.onClick ? this.props.onClick : undefined}
      />
    );
  }
}
